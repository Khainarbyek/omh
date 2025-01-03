import { ShopifyProduct } from "@/types/shopify_product";

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL!;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION!;

// Fetch shop details
const getShop = async (): Promise<string | Error> => {
    try {
        const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: `
                    {
                        shop {
                            name
                        }
                    }
                `,
            }),
        });

        const result = await response.json();
        if (result.errors) {
            return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
        }

        return result.data.shop.name;
    } catch (error) {
        return Promise.reject(new Error('Failed to fetch shop data' + error));
    }
};

// Fetch a specific product
const fetchProduct = async (id: string): Promise<ShopifyProduct> => {
    try {
        const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/products/${id}.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
            },
        });

        const result = await response.json();
        if (result.errors) {
            console.error('Error fetching product:', result.errors);
            return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
        }

        return result.product || {};
    } catch (error) {
        console.error(error);
        return Promise.reject(new Error('Failed to fetch product data' + error));
    }
};

// Create a new product
const createProduct = async (product: ShopifyProduct): Promise<ShopifyProduct> => {
    try {
        const productData = {
            product: {
                title: product.title,
                body_html: product.body_html,
                vendor: product.vendor,
                published: true,
                product_type: product.product_type,
                tags: product.tags,
                options: product.options,
                variants: product.variants,
                images: product.images,
            },
        };

        const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/products.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
            },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (result.errors) {
            return Promise.reject(new Error('Failed to create a product' + JSON.stringify(result.errors)));
        }

        return result.product;
    } catch (error) {
        return Promise.reject(new Error('Failed to create a product' + error));
    }
};

const cloneProduct = async (originalProductId: string, imageUrl: string) => {
    try {
        const shopName = await getShop();
        console.log('Shop Name:', shopName);

        const originalProduct = await fetchProduct(originalProductId);

        if (originalProduct.id === undefined) {
            throw new Error('Product not found');
        }
        // Modify the product for cloning
        const clonedProductData = {
            ...originalProduct,
            title: `${originalProduct.title} - Clone ${new Date().toISOString()}`,
            status: 'draft',
        };
        delete clonedProductData.id;

        clonedProductData.images =
            [
                {
                    src: imageUrl,
                    alt: `Product Image ${originalProductId}`,
                    position: 1
                },
                ...clonedProductData.images ?? [],
            ];

        const clonedProduct = await createProduct(clonedProductData);
        if (clonedProduct.id === undefined) {
            throw new Error('Product not created');
        }
        console.log('Cloned Product:', clonedProduct.id);
        // await updateInventory(clonedProduct.id, 10);
        return clonedProduct;
    } catch (error) {
        console.error('Error cloning product:', error);
        return null;
    }
};

// const updateInventory = async (productId: string, quality: number): Promise<boolean> => {
//     try {
//         const query = `
//             mutation inventoryAdjustQuantity($inventoryItemId: ID!, $locationId: ID!, $available: Int) {
//                 inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId, available: $available) {
//                     inventoryLevel {
//                         id
//                         quantities(names: ["available"]) {
//                             name
//                             quantity
//                         }
//                         item {
//                             id
//                         }
//                         location {
//                             id
//                         }
//                     }
//                 }
//             }
//         `;

//         const variables = {
//             files: [
//                 {
//                     "inventoryItemId": `gid://shopify/InventoryItem/${productId}`,
//                     "locationId": `gid://shopify/Location/${SHOPIFY_SHOP_LOCATION}`,
//                     "available": quality
//                 }
//             ]
//         };

//         const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
//             },
//             body: JSON.stringify({
//                 query: query,
//                 variables: variables
//             }),
//         });

//         const result = await response.json();
//         if (result.errors) {
//             return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
//         }

//         if(result.data.fileCreate.files.length > 0) {
//             return result.data.fileCreate.files[0].id;
//         }
//         return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
//     } catch (error) {
//         return Promise.reject(new Error('Failed to fetch shop data' + error));
//     }
// };

// const createImage = async (productId: string, image: string): Promise<string> => {
//     try {
//         const query = `
//             mutation fileCreate($files: [FileCreateInput!]!) {
//                 fileCreate(files: $files) {
//                     files {
//                         id
//                         fileStatus
//                         alt
//                         createdAt
//                     }
//                 }
//             }
//         `;

//         const variables = {
//             files: [
//                 {
//                     originalSource: "https://pixabay.com/get/g71e9505fc06e6834c3bea43c64e1fd07ee9251d94fc8eb7934c9d8e45e5dc16f231692d64083649369113b04210a1ac30b5564400aa32b666d3697fa22febc92_640.jpg",
//                     alt: "xainar",
//                     contentType: "IMAGE",
//                     filename: "xainar.jpg",
//                 }
//             ]
//         };

//         const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
//             },
//             body: JSON.stringify({
//                 query: query,
//                 variables: variables
//             }),
//         });

//         const result = await response.json();
//         if (result.errors) {
//             return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
//         }

//         if(result.data.fileCreate.files.length > 0) {
//             return result.data.fileCreate.files[0].id;
//         }
//         return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
//     } catch (error) {
//         return Promise.reject(new Error('Failed to fetch shop data' + error));
//     }
// };

// Clone an existing product


export { cloneProduct, getShop, fetchProduct, createProduct };

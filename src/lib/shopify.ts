import { ShopifyProduct } from "@/types/shopify_product";

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL!;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION!;

// Fetch shop details
const getShop = async (): Promise<string> => {
    try {
        const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
            },
        });

        const result = await response.json();
        if (result.ok === false) {
            return Promise.reject(new Error('Failed to fetch shop data' + JSON.stringify(result.errors)));
        }


        return result.shop.name;
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

// Clone an existing product
const cloneProduct = async (originalProductId: string) => {
    try {
        const shopName = await getShop();
        console.log('Shop Name:', shopName);

        const originalProduct = await fetchProduct(originalProductId);

        // Modify the product for cloning
        const clonedProductData = {
            ...originalProduct,
            title: `${originalProduct.title} - Clone ${new Date().toISOString()}`,
            status: 'draft',
        };
        delete clonedProductData.id;

        const clonedProduct = await createProduct(clonedProductData);
        console.log('Cloned Product:', clonedProduct);

        return clonedProduct;
    } catch (error) {
        console.error('Error cloning product:', error);
        return null;
    }
};

export { cloneProduct, getShop, fetchProduct, createProduct };

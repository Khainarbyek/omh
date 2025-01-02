export type ShopifyProduct = {
    id?: string;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    tags: string[];
    options?: unknown[]; // Refine this if possible
    variants?: unknown[]; // Refine this if possible
    images?: unknown[]; // Refine this if possible
};
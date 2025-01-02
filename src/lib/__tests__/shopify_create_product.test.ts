import { createProduct } from '../shopify';

describe('createProduct', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockProduct = {
        title: 'Test Product',
        body_html: '<strong>Good product!</strong>',
        vendor: 'Vendor',
        product_type: 'Type',
        tags: ['tag1', 'tag2'],
        options: [{ name: 'Size', values: ['S', 'M', 'L'] }],
        variants: [{ option1: 'S', price: '10.00', sku: '123' }],
        images: [{ src: 'http://example.com/image.png' }],
    };

    it('should return the created product when the API call is successful', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ product: mockProduct }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const createdProduct = await createProduct(mockProduct);
        expect(createdProduct).toEqual(mockProduct);
    });

    it('should throw an error when the API call returns errors', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ errors: { message: 'Error message' } }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(createProduct(mockProduct)).rejects.toThrow('Failed to create a product');
    });
});
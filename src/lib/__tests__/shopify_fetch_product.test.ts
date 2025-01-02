import { fetchProduct } from '../shopify';

describe('fetchProduct', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the product detail when the API call is successful', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                product: {
                    id: '9692855959837',
                    title: 'Sample Product',
                    body_html: '<p>Sample description</p>',
                    vendor: 'Sample Vendor',
                    product_type: 'Sample Type',
                    tags: ['sample', 'product'],
                },
            }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const product = await fetchProduct('9692855959837');
    
        expect(product.id).toBe('9692855959837');
        expect(product.title).toBe('Sample Product');
        expect(product).toHaveProperty('body_html');
    });

});
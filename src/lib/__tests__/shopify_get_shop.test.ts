import { getShop } from '../shopify';
describe('getShop', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the shop name when the API call is successful', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ shop: { name: 'Test Shop' } }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const shopName = await getShop();
        expect(shopName).toBe('Test Shop');
    });

    it('should throw an error when the API call is unsuccessful', async () => {
        const mockResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({ errors: { message: 'Error message' } }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(getShop()).rejects.toThrow('Failed to fetch shop data');
    });

    it('should throw an error when fetch fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getShop()).rejects.toThrow('Failed to fetch shop data');
    });
});
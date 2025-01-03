// File: pages/api/shopify.ts
import { cloneProduct } from '@/lib/shopify';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { originalProductId } = req.body;
        const clonedProduct = await cloneProduct(originalProductId);
        return res.status(200).json(clonedProduct);
    }
}

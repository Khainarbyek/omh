import { NextApiRequest, NextApiResponse } from 'next';
//Api docs: https://pixabay.com/api/docs

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // const { searchQuery, category, per_page, image_type } = req.body;

        // const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&category=${category}&image_type=${image_type}&order=popular&per_page=${per_page}`;
        // const response = await fetch(url);
        // const data = await response.json();

        return res.status(200).json({ message: 'POST request to /api/images', data: process.env.PIXABAY_API_KEY });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

import { NextApiRequest, NextApiResponse } from 'next';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { fileName, fileType } = req.body;

        const params = {
          // ACL: ObjectCannedACL.public_read,
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          ContentType: fileType,
          // Expires: new Date(Date.now() + 60 * 1000),
        };
    
        try {
          const command = new PutObjectCommand(params);
          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    
          res.status(200).json({ signedUrl });
        } catch (error) {
          console.error("Error generating signed URL:", error);
          res.status(500).json({ error: "Error generating signed URL" });
        }
    }
}

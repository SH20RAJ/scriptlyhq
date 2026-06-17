"use server";

import { v2 as cloudinary } from 'cloudinary';

export async function uploadImageAction(formData: FormData) {
  try {
    // Re-configure inside to ensure env vars are fresh
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dur9ihwo3',
      api_key: process.env.CLOUDINARY_API_KEY || '574574598852979',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'NT8BmpOe1_ThcsxsBKvalenNlCI',
    });

    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return { 
      url: result.secure_url, 
      public_id: result.public_id 
    };
  } catch (error: any) {
    console.error('Upload action error:', error);
    return { error: error.message || 'Upload failed' };
  }
}

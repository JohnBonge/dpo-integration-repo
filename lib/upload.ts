import { v2 as cloudinary } from 'cloudinary';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(file: File): Promise<string> {
  try {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Improved buffer handling
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Add upload options with proper typing
    const uploadOptions: UploadApiOptions = {
      folder: 'ingoma-tours/stories',
      resource_type: 'auto' as const,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      max_bytes: 5 * 1024 * 1024, // 5MB limit
      timeout: 60000, // 60 seconds timeout
    };

    // Use promise-based upload with proper typing
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, uploadOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary detailed error:', error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('No result from Cloudinary'));
        }
      });
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid Signature')) {
        throw new Error(
          'Authentication failed with Cloudinary. Please check your credentials.'
        );
      }
      if (error.message.includes('max_bytes')) {
        throw new Error('File size exceeds the maximum limit of 5MB.');
      }
    }

    throw new Error('Failed to upload image. Please try again.');
  }
}

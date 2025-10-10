import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'bandencentrale-images';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface S3UploadConfig {
  file: File;
  folder?: string;
  fileName?: string;
}

/**
 * Upload a file to S3 bucket
 */
export async function uploadToS3({ file, folder = 'products', fileName }: S3UploadConfig): Promise<UploadResult> {
  try {
    // Generate unique filename if not provided
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const key = fileName 
      ? `${folder}/${fileName}` 
      : `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Create upload command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // Make images publicly accessible
    });

    // Upload to S3
    await s3Client.send(command);

    // Generate public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete a file from S3 bucket
 */
export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
}

/**
 * Generate a presigned URL for secure uploads (alternative approach)
 */
export async function generatePresignedUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}

/**
 * Upload multiple files to S3
 */
export async function uploadMultipleToS3(files: File[], folder = 'products'): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadToS3({ file, folder }));
  return await Promise.all(uploadPromises);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB',
    };
  }

  return { valid: true };
}

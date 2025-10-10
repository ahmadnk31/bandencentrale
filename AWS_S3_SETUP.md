# AWS S3 Setup Guide for Image Upload

This guide will help you set up AWS S3 for image uploading in the Bandencentrale admin panel.

## Prerequisites

1. AWS Account
2. AWS S3 Bucket
3. IAM User with S3 permissions

## Step 1: Create an S3 Bucket

1. Log in to AWS Console
2. Navigate to S3 service
3. Create a new bucket (e.g., `bandencentrale-images`)
4. Configure bucket settings:
   - **Bucket name**: `bandencentrale-images` (must be globally unique)
   - **Region**: Choose your preferred region (e.g., `eu-west-1`)
   - **Public access**: Configure based on your needs

## Step 2: Configure Bucket Policy

Add this bucket policy to allow public read access to uploaded images:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::bandencentrale-images/*"
        }
    ]
}
```

## Step 3: Create IAM User

1. Navigate to IAM service
2. Create a new user (e.g., `bandencentrale-s3-user`)
3. Attach this policy to the user:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::bandencentrale-images/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::bandencentrale-images"
            ]
        }
    ]
}
```

4. Create access keys for the user
5. Save the Access Key ID and Secret Access Key

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your AWS credentials:

```env
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
NEXT_PUBLIC_S3_BUCKET_NAME=bandencentrale-images
```

## Step 5: Test Upload

1. Start the development server: `npm run dev`
2. Navigate to Admin > Products
3. Click "Add Product"
4. Upload images in the Images tab
5. Check your S3 bucket for uploaded files

## Security Considerations

### For Production:

1. **Use Server-Side Upload**: Instead of client-side uploads, create API routes that handle S3 uploads server-side
2. **Presigned URLs**: Use presigned URLs for secure uploads
3. **Environment Variables**: Use server-side environment variables (without `NEXT_PUBLIC_` prefix)
4. **IAM Roles**: Use IAM roles instead of access keys when deploying on AWS

### Example Server-Side API Route:

```typescript
// pages/api/upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle file upload securely
  }
}
```

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check bucket policy and IAM permissions
2. **CORS Errors**: Add CORS configuration to your S3 bucket
3. **Invalid Credentials**: Verify environment variables

### CORS Configuration:

Add this CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Features Included

- ✅ Drag & drop image upload
- ✅ Multiple file selection
- ✅ Real-time upload progress
- ✅ Image validation (type, size)
- ✅ Upload retry functionality
- ✅ Image preview and management
- ✅ AWS S3 integration
- ✅ Error handling
- ✅ Professional UI/UX

## File Structure

```
src/
├── lib/
│   ├── aws-s3.ts              # S3 upload utilities
│   └── product-data.ts        # Product data models
├── components/
│   ├── image-upload.tsx       # Image upload component
│   └── product-form.tsx       # Advanced product form
└── app/admin/products/
    └── page.tsx              # Enhanced products admin page
```

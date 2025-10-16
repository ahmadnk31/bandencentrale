# Vercel Environment Variables Setup

## Required Environment Variables for Production Deployment

### Authentication & Security
```bash
BETTER_AUTH_SECRET="your-super-secret-key-here-make-it-long-and-random-at-least-32-chars"
NEXTAUTH_SECRET="your-nextauth-secret-key-same-as-above"
BETTER_AUTH_URL="https://bandencentrale.vercel.app"
NEXTAUTH_URL="https://bandencentrale.vercel.app"
COOKIE_DOMAIN=".vercel.app"
```

### Database
```bash
DATABASE_URL="postgresql://neondb_owner:npg_BQ9sok8PurMe@ep-bitter-waterfall-agcolnfr-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Application URLs
```bash
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://bandencentrale.vercel.app"
```

### Optional Social Authentication
```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

### AWS Configuration (if using S3/SES)
```bash
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET_NAME="bandencentrale-uploads"
FROM_EMAIL="noreply@bandencentrale.be"
```

## Setup Steps

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: bandencentrale
3. **Go to Settings > Environment Variables**
4. **Add each variable above** with appropriate values
5. **Redeploy** your application

## Important Notes

- **BETTER_AUTH_URL** must match your actual Vercel deployment URL
- **COOKIE_DOMAIN** should be ".vercel.app" for Vercel deployments
- **DATABASE_URL** must be accessible from Vercel (your Neon database is correctly configured)
- **Generate strong secrets** for BETTER_AUTH_SECRET (at least 32 characters)

## Troubleshooting Login Issues

If login still doesn't work after setting environment variables:

1. Check Vercel deployment logs for any errors
2. Verify all environment variables are set correctly
3. Ensure your database is accessible from Vercel
4. Check that the auth API routes are working: `https://your-domain.vercel.app/api/auth/session`

## Testing Authentication

1. Visit your deployed site
2. Try to register a new account
3. Try to login with existing credentials
4. Check browser network tab for any 401/403 errors
5. Verify cookies are being set with correct domain

## Custom Domain Setup (Optional)

If you want to use a custom domain:

1. Add your domain in Vercel dashboard
2. Update environment variables:
   ```bash
   BETTER_AUTH_URL="https://yourdomain.com"
   NEXTAUTH_URL="https://yourdomain.com"
   COOKIE_DOMAIN=".yourdomain.com"
   ```

# Environment Variables Configuration

This document lists all the environment variables required for the BandenCentrale application to work properly in production.

## Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Authentication Configuration (Better Auth)
```
BETTER_AUTH_SECRET=your-random-secret-key-here
BETTER_AUTH_URL=https://yourdomain.com
```

### Alternative Auth Configuration (if using NextAuth)
```
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
```

### Google OAuth (for social login)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Facebook OAuth (optional)
```
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### AWS S3 Configuration (for image uploads)
```
NEXT_PUBLIC_AWS_REGION=your-aws-region
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
NEXT_PUBLIC_S3_BUCKET_NAME=your-bucket-name
```

### Email Configuration (AWS SES)
```
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
SES_FROM_EMAIL=noreply@yourdomain.com
```

### Vercel Specific (automatically set by Vercel)
```
VERCEL_URL=automatically-set-by-vercel
```

## Important Notes

### For Vercel Deployment:
1. Add all environment variables in your Vercel dashboard under Settings > Environment Variables
2. Make sure to set them for Production, Preview, and Development environments
3. The `VERCEL_URL` is automatically set by Vercel, but you should also set `BETTER_AUTH_URL` manually

### Security:
- Use strong, random secrets for `BETTER_AUTH_SECRET` (at least 32 characters)
- Never commit real environment variables to git
- Use different secrets for development and production

### Cookie Domain:
If you're using a custom domain, you may need to set:
```
COOKIE_DOMAIN=.yourdomain.com
```

## Debugging Authentication Issues

If login is not working in production:

1. Check that all environment variables are set correctly
2. Verify that `BETTER_AUTH_URL` matches your production domain
3. Ensure database is accessible from the hosting platform
4. Check the debug endpoint: `https://yourdomain.com/api/debug/auth` (add header `x-debug-auth: true` for production)

## Common Issues and Solutions

### Issue: Login works locally but not in production
**Solution:** Check that `BETTER_AUTH_URL` is set to your production domain, not localhost

### Issue: Cookies not being set
**Solution:** Ensure your domain supports HTTPS and check CORS settings

### Issue: Database connection errors
**Solution:** Verify `DATABASE_URL` is correct and the database is accessible from your hosting platform

### Issue: Social login redirect errors
**Solution:** Update OAuth provider settings to include your production domain in allowed redirect URLs

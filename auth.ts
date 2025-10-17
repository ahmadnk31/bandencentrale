import { db } from "@/lib/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email/ses";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Temporarily disable to avoid email issues
    sendResetPassword: async ({ user, url }) => {
      // Custom password reset email logic
      await sendPasswordResetEmail(user.email, url, user.name || '');
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },
  plugins: [
    // Email verification plugin
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    httpOnly: true, // Allow client-side JS to read the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production"
        ? ".bandencentrale.vercel.app"
        : "localhost",
    },
  },
  rateLimit: {
    window: 10 * 60, // 10 minutes
    max: 100, // 100 requests per window
    storage: "memory", // Use Redis in production
  },
  logger: {
    disabled: process.env.NODE_ENV === "production",
  },
  baseURL: process.env.NODE_ENV === "production" 
    ? (process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://bandencentrale.vercel.app")
    : "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://bandencentrale.vercel.app",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXTAUTH_URL ? [process.env.NEXTAUTH_URL] : []),
  ].filter(Boolean),
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

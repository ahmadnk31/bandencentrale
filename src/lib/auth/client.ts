import { createAuthClient } from "better-auth/react";

// Client-side URL detection
const getBaseURL = () => {
  // In the browser, use current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // On server side during SSR
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Fallback for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} = authClient;

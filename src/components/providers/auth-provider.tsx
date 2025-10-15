'use client';

import { authClient } from '@/lib/auth/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For now, just return children as Better Auth handles session management automatically
  return <>{children}</>;
}

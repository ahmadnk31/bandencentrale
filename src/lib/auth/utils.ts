import type { Session } from "@/lib/auth/config";

interface ExtendedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

interface ExtendedSession extends Omit<Session, 'user'> {
  user: ExtendedUser;
}

export function isAdmin(session: any): boolean {
  if (!session?.user) return false;
  
  const user = session.user as any;
  return user.role === 'admin';
}

export function hasRole(session: any, role: string): boolean {
  if (!session?.user) return false;
  
  const user = session.user as any;
  return user.role === role;
}

export type { ExtendedUser, ExtendedSession };

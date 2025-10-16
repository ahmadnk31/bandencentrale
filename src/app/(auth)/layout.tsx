import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Bandencentrale Auth',
    default: 'Authentication | Bandencentrale',
  },
  description: 'Sign in or create an account to access Bandencentrale tire services.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

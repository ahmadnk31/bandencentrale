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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Bandencentrale</span>
              </a>
            </div>
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="/tires" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="/services" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Services
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      
    </div>
  );
}

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar({ show }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ${
      show ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Last Call
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/auctions" className="text-gray-600 hover:text-gray-900">
              Auctions
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                    {user?.name || 'Profile'}
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Home, Plus, BarChart3, Wallet } from 'lucide-react';

export default function Navbar({ user }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-primary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="text-xl font-bold text-secondary-800">Base Buddies</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-secondary-100 text-secondary-700' 
                  : 'text-gray-600 hover:bg-primary-100 hover:text-secondary-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              href="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/create') 
                  ? 'bg-secondary-100 text-secondary-700' 
                  : 'text-gray-600 hover:bg-primary-100 hover:text-secondary-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>
            
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/dashboard') 
                  ? 'bg-secondary-100 text-secondary-700' 
                  : 'text-gray-600 hover:bg-primary-100 hover:text-secondary-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-white/60 px-3 py-2 rounded-lg border border-primary-200">
              <Wallet className="w-4 h-4 text-secondary-600" />
              <span className="text-sm text-secondary-700 font-medium">{user.balance}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-gradient-to-r from-secondary-500 to-secondary-600 px-3 py-2 rounded-lg text-white">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
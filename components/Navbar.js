"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Plus, BarChart3 } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Navbar() {
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

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
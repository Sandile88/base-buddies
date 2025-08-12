"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import WalletConnect from './WalletConnect';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => pathname === path;

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

          {/* Right side (Wallet + Mobile toggle) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WalletConnect />
            </div>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-primary-200 text-secondary-700"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden border-t border-primary-200 bg-white/90 backdrop-blur ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isActive('/') ? 'bg-secondary-100 text-secondary-700' : 'text-gray-700 hover:bg-primary-100'}`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isActive('/create') ? 'bg-secondary-100 text-secondary-700' : 'text-gray-700 hover:bg-primary-100'}`}
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isActive('/dashboard') ? 'bg-secondary-100 text-secondary-700' : 'text-gray-700 hover:bg-primary-100'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          {/* Wallet on very small screens */}
          <div className="sm:hidden pt-2">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
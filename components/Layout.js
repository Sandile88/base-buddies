"use client"

import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
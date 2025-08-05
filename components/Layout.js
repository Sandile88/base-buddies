import { useState } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [user] = useState({
    address: '0x1234...5678',
    balance: '0.125 ETH',
    challengesCreated: 12,
    challengesCompleted: 8,
    totalRewards: '0.05 ETH'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
"use client"

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, Search } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import Layout from '../components/Layout';
import ChallengeCard from '../components/ChallengeCard';
import WalletConnect from '../components/WalletConnect';
import { useGetAllChallenges } from '../lib/useContract';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isConnected } = useAccount();
  const { data: allChallenges, isLoading } = useGetAllChallenges();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);

  const toNumber = (value) => (typeof value === 'bigint' ? Number(value) : value ?? 0);
  const formatEth = (wei) => {
    if (wei === undefined || wei === null) return '0 ETH';
    const value = typeof wei === 'bigint' ? wei : BigInt(wei);
    const eth = Number(formatEther(value));
    return `${eth.toFixed(4)} ETH`;
  };
  const getTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const dl = toNumber(deadline);
    const timeLeft = dl - now;
    if (timeLeft <= 0) return 'Ended';
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };
  const isChallengeActive = (c) => {
    if (!c) return false;
    const now = Math.floor(Date.now() / 1000);
    const deadline = toNumber(c.deadline);
    return now <= deadline && toNumber(c.currentParticipants) < toNumber(c.maxParticipants);
  };

  const challenges = useMemo(() => {
    const list = Array.isArray(allChallenges) ? allChallenges : [];
    return list.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      reward: formatEth(c.reward),
      category: 'Social',
      timeLeft: getTimeLeft(c.deadline),
      participants: toNumber(c.currentParticipants),
      status: isChallengeActive(c) ? 'active' : 'ended',
      creator: c.creatorNickname || c.creatorAddress,
      proofType: 'file',
      raw: c,
    }));
  }, [allChallenges]);

  const categories = ['All', 'Social', 'Education', 'Lifestyle', 'Creative', 'Tech'];

  const filteredAndSorted = useMemo(() => {
    let list = challenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || ch.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    switch (sortBy) {
      case 'reward':
        list = list.sort((a, b) => Number(b.raw.reward) - Number(a.raw.reward));
        break;
      case 'participants':
        list = list.sort((a, b) => b.participants - a.participants);
        break;
      case 'ending':
        list = list.sort((a, b) => toNumber(a.raw.deadline) - toNumber(b.raw.deadline));
        break;
      case 'newest':
      default:
        list = list.sort((a, b) => Number(b.raw.id) - Number(a.raw.id));
        break;
    }
    return list;
  }, [challenges, searchTerm, selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500">Base Buddies</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover community challenges on Base. Browse freely; connect your wallet when you're ready to create or submit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link
                href="/create"
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Create Challenge
              </Link>
            ) : (
              <WalletConnect />
            )}
            <a href="#challenges" className="border-2 border-secondary-500 text-secondary-600 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-all">
              Browse Challenges
            </a>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-primary-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-secondary-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-secondary-50 hover:text-secondary-600 border border-primary-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-primary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              >
                <option value="newest">Newest</option>
                <option value="reward">Highest Reward</option>
                <option value="participants">Most Participants</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div id="challenges" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-8 text-gray-600">Loading challenges...</div>
          )}
          {!isLoading && filteredAndSorted.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No challenges found</div>
          )}
          {!isLoading && filteredAndSorted.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Load More placeholder (for future pagination) */}
        {/* <div className="text-center mt-12">
          <button className="bg-white/60 backdrop-blur-sm border border-primary-300 text-secondary-600 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:shadow-lg transition-all">
            Load More Challenges
          </button>
        </div> */}
      </div>
    </Layout>
  );
}
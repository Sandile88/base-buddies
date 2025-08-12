"use client"

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, Search } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useBlockNumber } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
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
  const { data: allChallenges, isLoading, refetch: refetchAllChallenges } = useGetAllChallenges();
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);

  // Auto-refresh challenges and countdowns
  const { data: homeBlockNumber } = useBlockNumber({ chainId: baseSepolia.id, watch: true });
  useEffect(() => {
    refetchAllChallenges?.();
  }, [homeBlockNumber, refetchAllChallenges]);

  useEffect(() => {
    const interval = setInterval(() => setRefreshSignal((x) => x + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const toNumber = (value) => (typeof value === 'bigint' ? Number(value) : value ?? 0);
  const formatEth = (wei) => {
    if (wei === undefined || wei === null) return '0 ETH';
    const value = typeof wei === 'bigint' ? wei : BigInt(wei);
    const eth = Number(formatEther(value));
    const decimals = eth >= 1 ? 4 : eth >= 0.001 ? 6 : 8;
    return `${eth.toFixed(decimals)} ETH`;
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

    const getMetaForChallenge = (challenge) => {
      try {
        const byIdKey = 'challengeMetaById';
        const pendingKey = 'challengeMetaPending';
        const byIdRaw = typeof window !== 'undefined' ? localStorage.getItem(byIdKey) : null;
        const pendingRaw = typeof window !== 'undefined' ? localStorage.getItem(pendingKey) : null;
        const byId = byIdRaw ? JSON.parse(byIdRaw) : {};
        const pending = pendingRaw ? JSON.parse(pendingRaw) : [];

        if (byId[String(challenge.id)]) {
          return byId[String(challenge.id)];
        }

        const matchIdx = pending.findIndex((p) =>
          p &&
          p.title === challenge.title &&
          p.description === challenge.description &&
          (p.creatorAddress?.toLowerCase?.() === challenge.creatorAddress?.toLowerCase?.()) &&
          Number(p.deadline) === Number(challenge.deadline) &&
          Number(p.maxParticipants) === Number(challenge.maxParticipants)
        );

        if (matchIdx !== -1) {
          const matched = pending[matchIdx];
          byId[String(challenge.id)] = matched;
          pending.splice(matchIdx, 1);
          localStorage.setItem(byIdKey, JSON.stringify(byId));
          localStorage.setItem(pendingKey, JSON.stringify(pending));
          return matched;
        }

        return null;
      } catch (_) {
        return null;
      }
    };

    const isValid = (c) => {
      try {
        const idNum = Number(c.id);
        const hasTitle = typeof c.title === 'string' && c.title.trim().length > 0;
        const deadline = toNumber(c.deadline);
        return idNum > 0 && hasTitle && deadline > 0;
      } catch {
        return false;
      }
    };

    return list.filter(isValid).map((c) => {
      const meta = getMetaForChallenge(c);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        reward: formatEth(c.reward),
        category: meta?.category || '',
        timeLeft: getTimeLeft(c.deadline),
        participants: toNumber(c.currentParticipants),
        status: isChallengeActive(c) ? 'active' : 'ended',
        creator: c.creatorNickname || c.creatorAddress,
        proofType: meta?.proofType || 'file',
        requirements: meta?.requirements,
        raw: c,
      };
    });
  }, [allChallenges, refreshSignal]);

  // Listen for delete broadcasts from other routes and bump refreshSignal
  useEffect(() => {
    const handler = () => setRefreshSignal((x) => x + 1);
    const storageHandler = (e) => {
      if (e.key === 'bb:challenge-deleted-id') handler();
    };
    window.addEventListener('bb:challenge-deleted', handler);
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('bb:challenge-deleted', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const categories = useMemo(() => {
    const fixed = ['Social', 'Education', 'Lifestyle', 'Creative', 'Tech'];
    const set = new Set(
      (challenges || [])
        .map((c) => c.category)
        .filter((c) => typeof c === 'string' && c.length > 0)
    );
    const discovered = Array.from(set).sort();
    const merged = Array.from(new Set([...fixed, ...discovered]));
    return ['All', ...merged];
  }, [challenges]);

  const filteredAndSorted = useMemo(() => {
    let list = (challenges || []).filter((ch) => {
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
          <h1 className="text-3xl md:text-5xl font-bold text-secondary-800 mb-3 md:mb-4 px-2 md:px-0">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500">Base Buddies</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4 md:px-0">
            Discover community challenges on Base. Browse freely; connect your wallet when you're ready to create or submit.
          </p>

          <div className="flex flex-row flex-wrap gap-3 md:gap-4 justify-center px-4 md:px-0">
            {isConnected ? (
              <Link
                href="/create"
                className="inline-flex items-center justify-center bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto h-12 px-6"
              >
                Create Challenge
              </Link>
            ) : (
              <div className="w-full sm:w-auto">
                <WalletConnect fullWidth size="lg" />
              </div>
            )}
            <a href="#challenges" className="inline-flex items-center justify-center border-2 border-secondary-500 text-secondary-600 rounded-lg font-semibold hover:bg-secondary-50 transition-all w-full sm:w-auto h-12 px-6">
              Browse Challenges
            </a>
          </div>
        </div>

        {/* How it works */}
        {!isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 px-4 md:px-0">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <div className="text-xl font-semibold text-secondary-800 mb-2">Browse</div>
              <p className="text-gray-600 text-sm">Explore challenges created by the community. No wallet needed to browse.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <div className="text-xl font-semibold text-secondary-800 mb-2">Connect</div>
              <p className="text-gray-600 text-sm">Connect your wallet to create a challenge or submit your proof.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <div className="text-xl font-semibold text-secondary-800 mb-2">Earn</div>
              <p className="text-gray-600 text-sm">Complete challenges on time to earn rewards paid by creators.</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-primary-200 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:flex-1 max-w-full lg:max-w-md">
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
            <div className="flex flex-nowrap overflow-x-auto gap-2 w-full lg:w-auto py-1">
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
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-sm text-gray-500">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-primary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 w-full lg:w-auto"
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
        <div id="challenges" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
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
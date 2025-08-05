import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Filter, Search, Clock, Trophy, Users } from 'lucide-react';
import Layout from '../components/Layout';
import ChallengeCard from '../components/ChallengeCard';

const mockChallenges = [
  {
    id: 1,
    title: "Share Your Pet's Cutest Moment",
    description: "Post a photo or video of your pet doing something adorable!",
    reward: "0.01 ETH",
    category: "Social",
    timeLeft: "2 days",
    participants: 23,
    status: "active",
    creator: "0xPetLover123",
    proofType: "image"
  },
  {
    id: 2,
    title: "Name a Historical Figure from the 1800s",
    description: "Tell us about an interesting historical figure from the 19th century and why they're significant.",
    reward: "0.005 ETH",
    category: "Education",
    timeLeft: "5 days",
    participants: 41,
    status: "active",
    creator: "0xHistoryBuff",
    proofType: "text"
  },
  {
    id: 3,
    title: "Show Us Your Favorite Recipe",
    description: "Share a photo of a dish you made along with the recipe!",
    reward: "0.015 ETH",
    category: "Lifestyle",
    timeLeft: "1 day",
    participants: 67,
    status: "active",
    creator: "0xChefMaster",
    proofType: "image"
  },
  {
    id: 4,
    title: "Recommend a Great Book",
    description: "Share a book recommendation with a brief review explaining why others should read it.",
    reward: "0.008 ETH",
    category: "Education",
    timeLeft: "3 days",
    participants: 15,
    status: "active",
    creator: "0xBookworm",
    proofType: "text"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Social', 'Education', 'Lifestyle', 'Creative', 'Tech'];

  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Head>
        <title>Base Buddies - Social Challenge Platform</title>
        <meta name="description" content="Join fun, low-stakes challenges and earn rewards on Base" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500">Base Buddies</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join fun, low-stakes challenges and earn rewards on Base. Create challenges, submit proofs, and build community together!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Challenge
            </Link>
            <button className="border-2 border-secondary-500 text-secondary-600 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-all">
              Browse Challenges
            </button>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-primary-200 text-center">
            <Trophy className="w-8 h-8 text-accent-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">1,247</div>
            <div className="text-gray-600">Active Challenges</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-primary-200 text-center">
            <Users className="w-8 h-8 text-success-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">8,392</div>
            <div className="text-gray-600">Active Participants</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-primary-200 text-center">
            <Clock className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800">12.5 ETH</div>
            <div className="text-gray-600">Total Rewards</div>
          </div>
        </div> */}

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
              <Filter className="w-4 h-4 text-gray-500" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white/60 backdrop-blur-sm border border-primary-300 text-secondary-600 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:shadow-lg transition-all">
            Load More Challenges
          </button>
        </div>
      </div>
    </Layout>
  );
}
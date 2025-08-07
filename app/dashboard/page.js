"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, Plus, TrendingUp, Users, Target } from 'lucide-react';
import Layout from '../../components/Layout';

const mockCreatedChallenges = [
  {
    id: 1,
    title: "Share Your Pet's Cutest Moment",
    status: "active",
    participants: 23,
    reward: "0.01 ETH",
    timeLeft: "2 days",
    submissions: 15
  },
  {
    id: 2,
    title: "Your Favorite Recipe",
    status: "completed",
    participants: 45,
    reward: "0.015 ETH",
    timeLeft: "Ended",
    submissions: 32
  }
];

const mockAcceptedChallenges = [
  {
    id: 3,
    title: "Name a Historical Figure",
    status: "submitted",
    creator: "0xHistoryBuff",
    reward: "0.005 ETH",
    timeLeft: "5 days",
    mySubmission: "Pending verification"
  },
  {
    id: 4,
    title: "Recommend a Great Book",
    status: "verified",
    creator: "0xBookworm",
    reward: "0.008 ETH",
    timeLeft: "Completed",
    mySubmission: "Verified ✓"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    address: '0x1234...5678',
    balance: '0.125 ETH',
    challengesCreated: 12,
    challengesCompleted: 8,
    totalRewards: '0.05 ETH'
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - Base Buddies</title>
        <meta name="description" content="Track your challenges and rewards" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your challenges and rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-accent-500" />
              <TrendingUp className="w-4 h-4 text-success-500" />
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">{user.totalRewards}</div>
            <div className="text-gray-600 text-sm">Total Rewards Earned</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Plus className="w-8 h-8 text-secondary-500" />
              <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                +{user.challengesCreated}
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">{user.challengesCreated}</div>
            <div className="text-gray-600 text-sm">Challenges Created</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-success-500" />
              <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">
                +{user.challengesCompleted}
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">{user.challengesCompleted}</div>
            <div className="text-gray-600 text-sm">Challenges Completed</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-accent-600" />
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                68
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">68</div>
            <div className="text-gray-600 text-sm">Total Participants</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'created', label: 'Created Challenges' },
            { id: 'accepted', label: 'Accepted Challenges' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-secondary-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white hover:text-secondary-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Challenge completed</div>
                    <div className="text-xs text-gray-600">"Recommend a Great Book" - 0.008 ETH earned</div>
                  </div>
                  <div className="text-xs text-gray-500">2h ago</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg">
                  <Trophy className="w-5 h-5 text-accent-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">New participant</div>
                    <div className="text-xs text-gray-600">"Share Your Pet's Cutest Moment" gained a participant</div>
                  </div>
                  <div className="text-xs text-gray-500">4h ago</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <Plus className="w-5 h-5 text-secondary-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Challenge created</div>
                    <div className="text-xs text-gray-600">"Your Favorite Recipe" is now live</div>
                  </div>
                  <div className="text-xs text-gray-500">1d ago</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  href="/create"
                  className="block w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-4 rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">Create New Challenge</div>
                      <div className="text-sm text-secondary-100">Launch a fun challenge for the community</div>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">Browse Challenges</div>
                      <div className="text-sm text-accent-100">Find new challenges to participate in</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'created' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-800">Your Created Challenges</h3>
              <Link
                href="/create"
                className="bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockCreatedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-primary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-1">{challenge.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{challenge.reward}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{challenge.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      challenge.status === 'active' 
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {challenge.submissions} submissions received
                    </div>
                    <Link
                      href={`/challenge/${challenge.id}`}
                      className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accepted' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-6">Your Accepted Challenges</h3>
            
            <div className="space-y-4">
              {mockAcceptedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-primary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-1">{challenge.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div>Creator: <span className="text-secondary-600">{challenge.creator}</span></div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{challenge.reward}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{challenge.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      challenge.status === 'verified' 
                        ? 'bg-success-100 text-success-700'
                        : challenge.status === 'submitted'
                        ? 'bg-warning-100 text-warning-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Status: {challenge.mySubmission}
                    </div>
                    <Link
                      href={`/challenge/${challenge.id}`}
                      className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                    >
                      View Challenge →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
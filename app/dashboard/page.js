"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, Plus, TrendingUp, Users, Target } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAccount } from 'wagmi';
import { useGetAllChallenges, useGetUserCreatedChallenges, useGetUserCompletedChallenges,useCompleteChallenge } from '../../lib/useContract';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { address } = useAccount();
  const { data: allChallenges, isLoading: loadingChallenges } = useGetAllChallenges();
  const { data: createdChallenges, isLoading: loadingCreated } = useGetUserCreatedChallenges(address);
  const { data: completedChallengeIds, isLoading: loadingCompleted } = useGetUserCompletedChallenges(address);
  const { completeChallenge, isLoading: completingChallenge } = useCompleteChallenge();

  // Calculate stats from real data
  const user = {
    address: address || 'Not connected',
    balance: '0.125 ETH', // This would need to be fetched separately
    challengesCreated: createdChallenges?.length || 0,
    challengesCompleted: completedChallengeIds?.length || 0,
    totalRewards: '0.05 ETH' // This would need to be calculated from completed challenges
  };

  const formatEth = (wei) => {
    if (!wei) return '0 ETH';
    const eth = parseFloat(wei) / 1e18;
    return `${eth.toFixed(4)} ETH`;
  };

  const isChallengeActive = (challenge) => {
    if (!challenge) return false;
    const now = Math.floor(Date.now() / 1000);
    return now <= challenge.deadline && challenge.currentParticipants < challenge.maxParticipants;
  };

  const getTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - now;
    if (timeLeft <= 0) return 'Ended';
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      await completeChallenge({ args: [challengeId] });
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - Base Buddies</title>
        <meta name="description" content="Track your challenges and rewards" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your challenges and rewards</p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-accent-500" />
              <TrendingUp className="w-4 h-4 text-secondary-500" />
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
              <Target className="w-8 h-8 text-secondary-500" />
              <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
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
              {allChallenges?.reduce((total, challenge) => total + challenge.currentParticipants, 0) || 0}

              </span>
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">
            {allChallenges?.reduce((total, challenge) => total + challenge.currentParticipants, 0) || 0}
            </div>
            <div className="text-gray-600 text-sm">Total Participants</div>
          </div>
        </div>

        {/* tabs */}
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

        
        {/* loading state */}
        {(loadingChallenges || loadingCreated || loadingCompleted) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading challenges...</p>
          </div>
        )}

        {/* tab content */}
        {activeTab === 'overview' && !loadingChallenges && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
              {allChallenges?.slice(0, 3).map((challenge, index) => (

                
                <div key={challenge.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <Plus className="w-5 h-5 text-secondary-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Challenge created</div>
                  <div className="text-xs text-gray-600">{challenge.title}" - {formatEth(challenge.reward)}</div>
                </div>
                <div className="text-xs text-gray-500">{getTimeLeft(challenge.deadline)} left</div>
                  </div>
                ))}
                {(!allChallenges || allChallenges.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    No challenges created yet
                  </div>
                )}
              </div>
            </div>

            {/* quick actions */}
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

        {activeTab === 'created' && !loadingCreated && (
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
              {createdChallenges.map((challenge) => (
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
                          <span>{challenge.currentParticipants}/{challenge.maxParticipants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{formatEth(challenge.reward)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeLeft(challenge.deadline)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isChallengeActive(challenge)
                        ? 'bg-secondary-100 text-secondary-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isChallengeActive(challenge) ? 'active' : 'ended'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                    Created by: {challenge.creatorNickname || 'Anonymous'}
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
            {(!createdChallenges || createdChallenges.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No challenges created yet</p>
                    <Link href="/create" className="text-secondary-600 hover:text-secondary-700 mt-2 inline-block">
                      Create your first challenge →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}


        {activeTab === 'accepted' && !loadingChallenges && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-6">Available Challenges</h3>
            
            <div className="space-y-4">
            {allChallenges?.filter(challenge => 
                challenge.creatorAddress !== address && isChallengeActive(challenge)
              ).map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-primary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-1">{challenge.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div>Creator: <span className="text-secondary-600">{challenge.creatorNickname || 'Anonymous'}</span></div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{formatEth(challenge.reward)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeLeft(challenge.deadline)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.currentParticipants}/{challenge.maxParticipants}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-700">
                      Available
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                    {challenge.description}
                    </div>
                    <button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      disabled={completingChallenge}
                      className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
                    >
                      {completingChallenge ? 'Completing...' : 'Complete Challenge'}
                    </button>
                  </div>
                </div>
              ))}
              {(!allChallenges || allChallenges.filter(challenge => 
                challenge.creatorAddress !== address && isChallengeActive(challenge)
              ).length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No available challenges</p>
                  <p className="text-sm">Check back later for new challenges!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
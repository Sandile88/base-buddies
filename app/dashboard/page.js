"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, Plus, TrendingUp, Users, Target, Edit, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { useAccount, useBalance, useBlockNumber } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { formatEther } from 'viem';
import { useGetAllChallenges, useGetUserCreatedChallenges, useGetUserCompletedChallenges, useCompleteChallenge, useDeleteChallenge, useEditChallenge, useRefundCreator, editChallengeParams } from '../../lib/useContract';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { address } = useAccount();
  const { data: allChallenges, isLoading: loadingChallenges, refetch: refetchAll } = useGetAllChallenges();
  const { data: createdChallenges, isLoading: loadingCreated, refetch: refetchCreated } = useGetUserCreatedChallenges(address);
  const { data: completedChallengeIds, isLoading: loadingCompleted, refetch: refetchCompleted } = useGetUserCompletedChallenges(address);
  const { completeChallenge, isLoading: completingChallenge, isSuccess: completeSuccess, error: completeError } = useCompleteChallenge();
  const { deleteChallenge, isLoading: deletingChallenge, isSuccess: deleteSuccess } = useDeleteChallenge();
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', reward: '', deadline: '' });
  const { editChallenge, isLoading: editingChallengeLoading, isSuccess: editSuccess } = useEditChallenge();


  const { refundCreator, isLoading: refundingCreator, isSuccess: refundSuccess, error: refundError } = useRefundCreator();


  const router = useRouter();
  const [lastDeletedId, setLastDeletedId] = useState(null);
  const [lastEditedId, setLastEditedId] = useState(null);
  const [lastCompletedId, setLastCompletedId] = useState(null);
  const [lastRefundedId, setLastRefundedId] = useState(null);




  const toNumber = (value) => (typeof value === 'bigint' ? Number(value) : value ?? 0);
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
  const allChallengesList = (Array.isArray(allChallenges) ? allChallenges : []).filter(isValid);
  const createdChallengesList = (Array.isArray(createdChallenges) ? createdChallenges : []).filter(isValid);

  // Calculate stats from real data
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
    watch: true,
  });

  // auto refresh dashboard data
  const { data: blockNumber } = useBlockNumber({ chainId: baseSepolia.id, watch: true });
  useEffect(() => {
    refetchAll?.();
    refetchCreated?.();
    refetchCompleted?.();
  }, [blockNumber, refetchAll, refetchCreated, refetchCompleted]);

  const totalRewardsWei = (Array.isArray(completedChallengeIds) ? completedChallengeIds : [])
    .reduce((acc, completedId) => {
      const match = allChallengesList.find((c) => Number(c.id) === Number(completedId));
      const rewardWei = match?.reward ?? 0n;
      return acc + (typeof rewardWei === 'bigint' ? rewardWei : BigInt(rewardWei || 0));
    }, 0n);

    const formatEth = (wei) => {
      if (wei === undefined || wei === null) return '0 ETH';
      const value = typeof wei === 'bigint' ? wei : BigInt(wei);
      const eth = Number(formatEther(value));
      const decimals = eth >= 1 ? 4 : eth >= 0.001 ? 6 : 8;
      return `${eth.toFixed(decimals)} ETH`;
    };
    
  const user = {
    address: address || 'Not connected',
    balance: formatEth(balanceData?.value ?? 0n),
    challengesCreated: createdChallengesList.length || 0,
    challengesCompleted: completedChallengeIds?.length || 0,
    totalRewards: formatEth(totalRewardsWei),
  };


  const isChallengeActive = (challenge) => {
    if (!challenge) return false;
    const now = Math.floor(Date.now() / 1000);
    const deadline = toNumber(challenge.deadline);
    const currentParticipants = toNumber(challenge.currentParticipants);
    const maxParticipants = toNumber(challenge.maxParticipants);
    return now <= deadline && currentParticipants < maxParticipants;
  };

  const isChallengeRefundable = (challenge) => {
    if (!challenge) return false;
    const now = Math.floor(Date.now() / 1000);
    const claimDeadline = toNumber(challenge.deadline) + (10 * 60); // 10 minutes after deadline
    const currentParticipants = toNumber(challenge.currentParticipants);
    const maxParticipants = toNumber(challenge.maxParticipants);
    
    // Refundable if claim deadline has passed and not all participants claimed
    return now > claimDeadline && currentParticipants < maxParticipants;
  };

  const getTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const dl = toNumber(deadline);
    const timeLeft = dl - now;
    if (timeLeft <= 0) return 'Ended';
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // FIXED: Proper complete challenge handler
  const handleCompleteChallenge = async (challengeId, creatorAddress) => {
    try {
      // Prevent creators from completing their own challenges
      if (address && creatorAddress && address.toLowerCase() === creatorAddress.toLowerCase()) {
        alert('Creators cannot complete their own challenges.');
        return;
      }

      console.log('Completing challenge:', challengeId);
      setLastCompletedId(challengeId);
      
      // Call the contract function
      await completeChallenge(challengeId);
    } catch (error) {
      console.error('Error completing challenge:', error);
      
      // Handle specific contract errors
      let errorMessage = 'Unknown error';
      if (error?.message?.includes('already completed')) {
        errorMessage = 'You have already completed this challenge!';
      } else if (error?.message?.includes('Challenge is full')) {
        errorMessage = 'Challenge is full!';
      } else if (error?.message?.includes('deadline has already passed')) {
        errorMessage = 'Challenge deadline has passed!';
      } else if (error?.message?.includes('already participated')) {
        errorMessage = 'You have already participated in this challenge!';
      } else if (error?.message?.includes('Insufficient contract balance')) {
        errorMessage = 'Contract has insufficient funds to pay rewards!';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert('Failed to complete challenge: ' + errorMessage);
      setLastCompletedId(null);
    }
  };

  // Handle successful challenge completion
  useEffect(() => {
    if (completeSuccess && lastCompletedId) {
      console.log('Challenge completed successfully!');
      alert('🎉 Challenge completed successfully! Reward has been transferred to your wallet.');
      
      // Refresh all data
      refetchAll?.();
      refetchCreated?.();
      refetchCompleted?.();
      
      // Reset state
      setLastCompletedId(null);
    }
  }, [completeSuccess, lastCompletedId, refetchAll, refetchCreated, refetchCompleted]);

  // Handle completion error
  useEffect(() => {
    if (completeError) {
      console.error('Challenge completion failed:', completeError);
      alert('Failed to complete challenge: ' + (completeError?.message || 'Transaction failed'));
      setLastCompletedId(null);
    }
  }, [completeError]);

  
  // ADDED: Refund Creator handler
  const handleRefundCreator = async (challengeId) => {
    try {
      const confirmed = window.confirm(
        'Refund unclaimed rewards? This will return any remaining ETH from participants who didn\'t complete the challenge.'
      );
      if (!confirmed) return;
      
      console.log('Refunding creator for challenge:', challengeId);
      setLastRefundedId(challengeId);
      
      await refundCreator(challengeId);
    } catch (error) {
      console.error('Error refunding creator:', error);
      
      let errorMessage = 'Unknown error';
      if (error?.message?.includes('Only creator can refund')) {
        errorMessage = 'Only the challenge creator can request a refund!';
      } else if (error?.message?.includes('Claim deadline has not yet passed')) {
        errorMessage = 'Cannot refund yet - claim deadline has not passed!';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert('Failed to refund: ' + errorMessage);
      setLastRefundedId(null);
    }
  };

  // Handle successful refund
  useEffect(() => {
    if (refundSuccess && lastRefundedId) {
      console.log('Creator refund successful!');
      alert('💰 Refund successful! Unclaimed rewards have been returned to your wallet.');
      
      // Refresh all data
      refetchAll?.();
      refetchCreated?.();
      refetchCompleted?.();
      
      // Reset state
      setLastRefundedId(null);
    }
  }, [refundSuccess, lastRefundedId, refetchAll, refetchCreated, refetchCompleted]);

  // Handle refund error
  useEffect(() => {
    if (refundError) {
      console.error('Creator refund failed:', refundError);
      alert('Failed to process refund: ' + (refundError?.message || 'Transaction failed'));
      setLastRefundedId(null);
    }
  }, [refundError]);


  const handleDeleteChallenge = async (challengeId) => {
    try {
      const confirmed = window.confirm('Delete this challenge? This cannot be undone.');
      if (!confirmed) return;
      setLastDeletedId(challengeId);
      await deleteChallenge({ args: [challengeId] });
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  // After successful delete, refresh views and clean local metadata
  useEffect(() => {
    if (!deleteSuccess) return;
    try {
      const byIdKey = 'challengeMetaById';
      const raw = localStorage.getItem(byIdKey);
      if (raw) {
        const obj = JSON.parse(raw);
        localStorage.setItem(byIdKey, JSON.stringify(obj));
      }
      if (lastDeletedId !== null && lastDeletedId !== undefined) {
        localStorage.setItem('bb:challenge-deleted-id', `${String(lastDeletedId)}:${Date.now()}`);
        window.dispatchEvent(new CustomEvent('bb:challenge-deleted', { detail: { id: String(lastDeletedId) } }));
      }
    } catch (_) {}
    refetchAll?.();
    refetchCreated?.();
    refetchCompleted?.();
    router.refresh();
    setLastDeletedId(null);
  }, [deleteSuccess, refetchAll, refetchCreated, refetchCompleted, router, lastDeletedId]);

  const handleEditChallenge = (challenge) => {
    setEditingChallenge(challenge);
    
    // converting deadline back to date string for the input
    const deadlineDate = new Date(toNumber(challenge.deadline) * 1000);
    const dateString = deadlineDate.toISOString().slice(0, 16); 
    
    const rewardInEth = Number(formatEther(challenge.reward));
    
    setEditForm({
      title: challenge.title,
      description: challenge.description,
      reward: rewardInEth.toString(),
      deadline: dateString
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editForm.title.trim() || !editForm.description.trim()) {
        alert('Title and description are required');
        return;
      }
      
      if (!editForm.reward || isNaN(editForm.reward) || Number(editForm.reward) <= 0) {
        alert('Please enter a valid reward amount');
        return;
      }
      
      if (!editForm.deadline) {
        alert('Please select a deadline');
        return;
      }
      
      const deadlineTimestamp = Math.floor(new Date(editForm.deadline).getTime() / 1000);
      
      const now = Math.floor(Date.now() / 1000);
      if (deadlineTimestamp <= now) {
        alert('Deadline must be in the future');
        return;
      }
      
      setLastEditedId(editingChallenge.id);
      const params = editChallengeParams(
        editingChallenge.id, 
        editForm.title, 
        editForm.description,
        Number(editForm.reward),
        deadlineTimestamp
      );
      await editChallenge(params);
    } catch (error) {
      console.error('Error editing challenge:', error);
      alert('Failed to edit challenge: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingChallenge(null);
    setEditForm({ title: '', description: '', reward: '', deadline: '' });
  };

  // After successful edit, refresh views and update local metadata
  useEffect(() => {
    if (!editSuccess) return;
    try {
      const byIdKey = 'challengeMetaById';
      const raw = localStorage.getItem(byIdKey);
      if (raw && lastEditedId !== null && lastEditedId !== undefined) {
        const obj = JSON.parse(raw);
        if (obj[String(lastEditedId)]) {
          obj[String(lastEditedId)] = {
            ...obj[String(lastEditedId)],
          };
          localStorage.setItem(byIdKey, JSON.stringify(obj));
        }
        localStorage.setItem('bb:challenge-edited-id', `${String(lastEditedId)}:${Date.now()}`);
        window.dispatchEvent(new CustomEvent('bb:challenge-edited', { detail: { id: String(lastEditedId) } }));
      }
    } catch (_) {}
    
    setEditingChallenge(null);
    setEditForm({ title: '', description: '', reward: '', deadline: '' });
    
    refetchAll?.();
    refetchCreated?.();
    refetchCompleted?.();
    router.refresh();
    setLastEditedId(null);
  }, [editSuccess, refetchAll, refetchCreated, refetchCompleted, router, lastEditedId]);


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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
              {allChallengesList.reduce((total, challenge) => total + toNumber(challenge.currentParticipants), 0) || 0}

              </span>
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">
            {allChallengesList.reduce((total, challenge) => total + toNumber(challenge.currentParticipants), 0) || 0}
            </div>
            <div className="text-gray-600 text-sm">Total Participants</div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 md:mb-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
              {allChallengesList.slice(0, 3).map((challenge, index) => (

                
                <div key={challenge.id} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                  <Plus className="w-5 h-5 text-secondary-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Challenge created</div>
                  <div className="text-xs text-gray-600">{challenge.title}" - {formatEth(challenge.reward)}</div>
                </div>
                <div className="text-xs text-gray-500">{getTimeLeft(challenge.deadline)} left</div>
                  </div>
                ))}
               {(allChallengesList.length === 0) && (
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
              {createdChallengesList.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-primary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-secondary-800 mb-1">{challenge.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{toNumber(challenge.currentParticipants)}/{toNumber(challenge.maxParticipants)} participants</span>
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
                        : isChallengeRefundable(challenge)
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isChallengeActive(challenge) 
                        ? 'active' 
                        : isChallengeRefundable(challenge)
                        ? 'refundable'
                        : 'ended'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-gray-600">
                    Created by: {challenge.creatorNickname || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/challenge/${challenge.id}`}
                        className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                      {isChallengeActive(challenge) && (
                        <button
                          onClick={() => handleEditChallenge(challenge)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                      {isChallengeRefundable(challenge) && (
                        <button
                          onClick={() => handleRefundCreator(challenge.id)}
                          disabled={refundingCreator && lastRefundedId === challenge.id}
                          className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                        >
                          {(refundingCreator && lastRefundedId === challenge.id) 
                            ? 'Refunding...' 
                            : 'Refund'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        disabled={deletingChallenge}
                        className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        {deletingChallenge ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {(createdChallengesList.length === 0) && (
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
            {allChallengesList.filter(challenge => 
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
                           <span>{toNumber(challenge.currentParticipants)}/{toNumber(challenge.maxParticipants)}</span>
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
                      onClick={() => handleCompleteChallenge(challenge.id, challenge.creatorAddress)}
                      disabled={completingChallenge && lastCompletedId === challenge.id}
                      className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(completingChallenge && lastCompletedId === challenge.id) 
                        ? 'Completing...' 
                        : 'Complete Challenge'}
                    </button>
                  </div>
                </div>
              ))}
              {((allChallengesList.length === 0) || allChallengesList.filter(challenge => 
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

       {/* Edit Challenge Modal */}
      {editingChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">Edit Challenge</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="Challenge title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="Challenge description"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editingChallengeLoading}
                className="bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50"
              >
                {editingChallengeLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
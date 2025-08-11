"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Users, Trophy, Upload, Send, CheckCircle, XCircle, ArrowLeft, Share } from 'lucide-react';
import { formatEther } from 'viem';
import Layout from '../../../components/Layout';
import { useGetChallenge } from '../../../lib/useContract';

export default function ChallengeDetails() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const challengeId = idParam !== undefined ? BigInt(idParam) : undefined;
  const [activeTab, setActiveTab] = useState('details');
  const [submission, setSubmission] = useState('');
  const [file, setFile] = useState(null);

  const { data, isLoading, error } = useGetChallenge(challengeId);

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
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const isChallengeActive = (challenge) => {
    if (!challenge) return false;
    const now = Math.floor(Date.now() / 1000);
    const deadline = toNumber(challenge.deadline);
    const currentParticipants = toNumber(challenge.currentParticipants);
    const maxParticipants = toNumber(challenge.maxParticipants);
    return now <= deadline && currentParticipants < maxParticipants;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to smart contract
    console.log('Submitting proof:', { submission, file });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const challenge = data
    ? {
        id: data.id,
        title: data.title,
        description: data.description,
        creatorNickname: data.creatorNickname,
        creatorAddress: data.creatorAddress,
        rewardWei: data.reward,
        reward: formatEth(data.reward),
        deadline: data.deadline,
        timeLeft: getTimeLeft(data.deadline),
        participants: toNumber(data.currentParticipants),
        maxParticipants: toNumber(data.maxParticipants),
        status: isChallengeActive(data) ? 'active' : 'ended',
        claimDeadline: data.claimDeadline,
      }
    : null;

  return (
    <Layout>
      <Head>
        <title>{challenge?.title ? `${challenge.title} - Base Buddies` : 'Challenge - Base Buddies'}</title>
        <meta name="description" content={challenge?.description || 'Challenge details'} />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* back button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-secondary-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {isLoading && (
          <div className="text-center py-16 text-gray-600">Loading challenge...</div>
        )}

        {!isLoading && (error || !challenge) && (
          <div className="text-center py-16 text-gray-600">Challenge not found.</div>
        )}

        {!isLoading && challenge && (
        {/* Challenge Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${challenge.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'}`}>
                  {challenge.status}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-secondary-800 mb-4">{challenge.title}</h1>
              <p className="text-gray-600 mb-6">{challenge.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.timeLeft} left</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{challenge.participants}/{challenge.maxParticipants} participants</span>
                </div>
                <div className="text-xs">
                  Created by <span className="text-secondary-600 font-medium">{challenge.creatorNickname || challenge.creatorAddress}</span>
                </div>
              </div>
            </div>

            {/* Reward Card */}
            <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6 text-center min-w-[200px]">
              <Trophy className="w-8 h-8 text-accent-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent-700 mb-1">{challenge.reward}</div>
              <div className="text-accent-600 text-sm">Total Reward</div>
              <button className="w-full mt-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all">
                <Share className="w-4 h-4 inline mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'details', label: 'Details' },
            { id: 'submit', label: 'Submit Proof' },
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
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-8">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">Challenge Requirements</h3>
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                  <p className="text-gray-700">No additional requirements specified.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">Proof Type</h3>
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-secondary-600" />
                  <span className="text-gray-700 capitalize">Upload</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">Timeline</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Ends: {challenge.timeLeft}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-4">Submit Your Proof</h3>
                <p className="text-gray-600 mb-6">
                  Upload your file and provide any additional context below.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-800 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center hover:border-secondary-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600 mb-2">
                    Drop your file here or click to browse
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-secondary-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary-600 transition-colors"
                  >
                    Choose File
                  </label>
                  {file && (
                    <div className="mt-2 text-sm text-secondary-600 font-medium">
                      {file.name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-secondary-800 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Describe your submission..."
                  rows={4}
                  className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Proof</span>
              </button>
            </form>
          )}
        </div>
        )}
        </div>
      </div>
    </Layout>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  Users,
  Trophy,
  Upload,
  Send,
  ArrowLeft,
  Share,
} from "lucide-react";
import { formatEther } from "viem";
import Layout from "../../../components/Layout";
import WalletConnect from "../../../components/WalletConnect";
import { useAccount } from "wagmi";
import { useGetChallenge } from "../../../lib/useContract";

export default function ChallengeDetails() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const challengeId =
    idParam !== undefined ? BigInt(idParam) : undefined;
  const [activeTab, setActiveTab] = useState("details");
  const [submission, setSubmission] = useState("");
  const [file, setFile] = useState(null);

  const { data, isLoading, error } = useGetChallenge(challengeId);

  const toNumber = (value) =>
    typeof value === "bigint" ? Number(value) : value ?? 0;

  const formatEth = (wei) => {
    if (wei === undefined || wei === null) return "0 ETH";
    const value = typeof wei === "bigint" ? wei : BigInt(wei);
    const eth = Number(formatEther(value));
    return `${eth.toFixed(4)} ETH`;
  };

  const getTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const dl = toNumber(deadline);
    const timeLeft = dl - now;
    if (timeLeft <= 0) return "Ended";
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor(
      (timeLeft % (24 * 60 * 60)) / (60 * 60)
    );
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const isChallengeActive = (challenge) => {
    if (!challenge) return false;
    const now = Math.floor(Date.now() / 1000);
    const deadline = toNumber(challenge.deadline);
    const currentParticipants = toNumber(
      challenge.currentParticipants
    );
    const maxParticipants = toNumber(challenge.maxParticipants);
    return (
      now <= deadline && currentParticipants < maxParticipants
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting proof:", { submission, file });
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
        status: isChallengeActive(data) ? "active" : "ended",
        claimDeadline: data.claimDeadline,
      }
    : null;

  const { isConnected } = useAccount();

  const meta = useMemo(() => {
    if (!challenge) return null;
    try {
      const byIdKey = 'challengeMetaById';
      const byIdRaw = typeof window !== 'undefined' ? localStorage.getItem(byIdKey) : null;
      const byId = byIdRaw ? JSON.parse(byIdRaw) : {};
      return byId[String(challenge.id)] || null;
    } catch (_) {
      return null;
    }
  }, [challenge]);

  return (
    <Layout>
      <Head>
        <title>
          {challenge?.title
            ? `${challenge.title} - Base Buddies`
            : "Challenge - Base Buddies"}
        </title>
        <meta
          name="description"
          content={challenge?.description || "Challenge details"}
        />
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
          <div className="text-center py-16 text-gray-600">
            Loading challenge...
          </div>
        )}

        {!isLoading && (error || !challenge) && (
          <div className="text-center py-16 text-gray-600">
            Challenge not found.
          </div>
        )}

        {!isLoading && challenge && (
          <>
            {/* challenge header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {(meta?.category) && (
                      <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
                        {meta.category}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        challenge.status === "active"
                          ? "bg-success-100 text-success-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {challenge.status}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-secondary-800 mb-4">
                    {challenge.title}
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.timeLeft} left</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {challenge.participants}/
                        {challenge.maxParticipants} participants
                      </span>
                    </div>
                    <div className="text-xs">
                      Created by{" "}
                      <span className="text-secondary-600 font-medium">
                        {challenge.creatorNickname ||
                          challenge.creatorAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* reward card */}
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6 text-center min-w-[200px]">
                  <Trophy className="w-8 h-8 text-accent-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-700 mb-1">
                    {challenge.reward}
                  </div>
                  <div className="text-accent-600 text-sm">
                    Total Reward
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all">
                    <Share className="w-4 h-4 inline mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* tabs */}
            <div className="flex space-x-1 mb-8">
              {[
                { id: "details", label: "Details" },
                { id: "submit", label: "Submit Proof" },
                { id: 'submissions', label: 'Submissions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-secondary-500 text-white shadow-lg"
                      : "bg-white/60 text-gray-600 hover:bg-white hover:text-secondary-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* tab content */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-8">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                      Challenge Requirements
                    </h3>
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                      {meta?.requirements ? (
                        <p className="text-gray-700">{meta.requirements}</p>
                      ) : (
                        <p className="text-gray-700">No additional requirements specified.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                      Proof Type
                    </h3>
                    <div className="flex items-center space-x-3">
                      <Upload className="w-5 h-5 text-secondary-600" />
                      <span className="text-gray-700 capitalize">
                        {meta?.proofType ? `${meta.proofType} ${meta.proofType === 'text' ? 'Response' : meta.proofType === 'link' ? 'Link' : 'Upload'}` : 'File Upload'}
                      </span>

                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                      Timeline
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Created: {meta?.createdAt ? new Date(meta.createdAt * 1000).toLocaleString() : 'N/A'}</div>
                      <div>Ends: {challenge.timeLeft}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "submit" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">Submit Your Proof</h3>
                    {!isConnected && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="text-yellow-800 text-sm mb-3">Connect your wallet to submit your proof.</div>
                        <WalletConnect />
                      </div>
                    )}
                    <p className="text-gray-600 mb-6">
                      {meta?.proofType === 'text' && 'Provide a text response below.'}
                      {meta?.proofType === 'image' && 'Upload an image as your proof.'}
                      {meta?.proofType === 'link' && 'Provide a link to your proof.'}
                      {!meta?.proofType && 'Provide your submission below.'}
                    </p>
                  </div>

                  {meta?.proofType === 'text' && (
                    <div>
                      <label htmlFor="text-proof" className="block text-sm font-semibold text-secondary-800 mb-2">Text Response</label>
                      <textarea
                        id="text-proof"
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="Write your response..."
                        rows={6}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all resize-none"
                        disabled={!isConnected}
                      />
                    </div>
                  )}

                  {meta?.proofType === 'image' && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Upload Image</label>
                      <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center hover:border-secondary-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-600 mb-2">Drop your image here or click to browse</div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" disabled={!isConnected} />
                        <label htmlFor="file-upload" className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${isConnected ? 'bg-secondary-500 text-white hover:bg-secondary-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                          Choose File
                        </label>
                        {file && (<div className="mt-2 text-sm text-secondary-600 font-medium">{file.name}</div>)}
                      </div>
                    </div>
                  )}

                  {meta?.proofType === 'link' && (
                    <div>
                      <label htmlFor="link-proof" className="block text-sm font-semibold text-secondary-800 mb-2">Proof Link</label>
                      <input
                        id="link-proof"
                        type="url"
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
                        disabled={!isConnected}
                      />
                    </div>
                  )}

                  {!meta?.proofType && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Upload File</label>
                      <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center hover:border-secondary-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-600 mb-2">Drop your file here or click to browse</div>
                        <input type="file" onChange={handleFileChange} className="hidden" id="file-upload-generic" disabled={!isConnected} />
                        <label htmlFor="file-upload-generic" className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${isConnected ? 'bg-secondary-500 text-white hover:bg-secondary-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                          Choose File
                        </label>
                        {file && <div className="mt-2 text-sm text-secondary-600 font-medium">{file.name}</div>}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isConnected) return;
                      handleSubmit(e);
                    }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${isConnected ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!isConnected}
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Proof</span>
                  </button>
                </div>
              )}
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                      Submissions
                    </h3>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    Submissions will appear here once implemented.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

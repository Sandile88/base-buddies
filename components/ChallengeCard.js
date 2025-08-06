"use client";

import Link from 'next/link';
import { Clock, Users, Trophy, ExternalLink } from 'lucide-react';

export default function ChallengeCard({ challenge }) {
  const getCategoryColor = (category) => {
    const colors = {
      Social: 'bg-accent-100 text-accent-700',
      Education: 'bg-secondary-100 text-secondary-700',
      Lifestyle: 'bg-success-100 text-success-700',
      Creative: 'bg-purple-100 text-purple-700',
      Tech: 'bg-blue-100 text-blue-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getProofTypeIcon = (proofType) => {
    switch (proofType) {
      case 'image':
        return '📷';
      case 'text':
        return '📝';
      case 'link':
        return '🔗';
      default:
        return '📄';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(challenge.category)}`}>
            {challenge.category}
          </span>
          <div className="flex items-center space-x-1 text-gray-500">
            <span className="text-sm">{getProofTypeIcon(challenge.proofType)}</span>
            <span className="text-xs">{challenge.proofType}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-bold text-secondary-800 mb-2 group-hover:text-secondary-600 transition-colors">
          {challenge.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        {/* Reward */}
        <div className="flex items-center justify-center bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-3 mb-4">
          <Trophy className="w-5 h-5 text-accent-600 mr-2" />
          <span className="text-accent-700 font-bold text-lg">{challenge.reward}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{challenge.timeLeft}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants} joined</span>
          </div>
        </div>

        {/* Creator */}
        <div className="text-xs text-gray-500 mb-4">
          Created by <span className="text-secondary-600 font-medium">{challenge.creator}</span>
        </div>

        {/* Action Button */}
        <Link
          href={`/challenge/${challenge.id}`}
          className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 group/button"
        >
          <span>View Challenge</span>
          <ExternalLink className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
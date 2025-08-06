"use client"

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Trophy, Upload, Link as LinkIcon, Type, Clock, Users } from 'lucide-react';
import Layout from '../../components/Layout';

const proofTypes = [
  { value: 'image', label: 'Image Upload', icon: Upload },
  { value: 'text', label: 'Text Response', icon: Type },
  { value: 'link', label: 'Link Submission', icon: LinkIcon }
];

export default function CreateChallenge() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Social',
    reward: '',
    duration: '7',
    proofType: 'image',
    requirements: '',
  });

  const categories = ['Social', 'Education', 'Lifestyle', 'Creative', 'Tech'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with smart contract
    console.log('Creating challenge:', formData);
    router.push('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <Head>
        <title>Create Challenge - Base Buddies</title>
        <meta name="description" content="Create a new challenge on Base Buddies" />
      </Head>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Create New Challenge</h1>
          <p className="text-gray-600">Launch a fun challenge and build community engagement!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-secondary-800 mb-2">
              Challenge Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Share Your Pet's Cutest Moment"
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-secondary-800 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what participants need to do..."
              rows={4}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all resize-none"
              required
            />
          </div>

          {/* Category and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-secondary-800 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-secondary-800 mb-2">
                Duration (days) *
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
                required
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          {/* Proof Type */}
          <div>
            <label className="block text-sm font-semibold text-secondary-800 mb-3">
              Proof Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proofTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="proofType"
                      value={type.value}
                      checked={formData.proofType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                      formData.proofType === type.value
                        ? 'border-secondary-500 bg-secondary-50'
                        : 'border-primary-300 hover:border-secondary-300'
                    }`}>
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        formData.proofType === type.value ? 'text-secondary-600' : 'text-gray-500'
                      }`} />
                      <div className={`text-sm font-medium ${
                        formData.proofType === type.value ? 'text-secondary-800' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Reward */}
          <div>
            <label htmlFor="reward" className="block text-sm font-semibold text-secondary-800 mb-2">
              Reward Amount (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                id="reward"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="0.01"
                step="0.001"
                min="0.001"
                className="w-full px-4 py-3 pl-12 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
                required
              />
              <Trophy className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-500 w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum reward: 0.001 ETH</p>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-semibold text-secondary-800 mb-2">
              Additional Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Any specific requirements or guidelines..."
              rows={3}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all resize-none"
            />
          </div>

          {/* Preview Card */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-800 mb-4">Preview</h3>
            <div className="bg-white rounded-lg p-4 border border-primary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-semibold">
                  {formData.category}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formData.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-accent-500" />
                    <span className="font-semibold">{formData.reward || '0.00'} ETH</span>
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-1">
                {formData.title || 'Challenge Title'}
              </h4>
              <p className="text-gray-600 text-sm">
                {formData.description || 'Challenge description will appear here...'}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 border-2 border-primary-300 text-gray-600 py-3 px-6 rounded-lg font-semibold hover:bg-primary-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Challenge
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
'use client';

import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from './contract';
import { parseEther } from 'viem';

export const useGetAllChallenges = () => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getAllChallenges',
  });
};

export const useGetChallenge = (challengeId) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getChallenge',
    args: [challengeId],
    enabled: challengeId !== undefined,
  });
};

export const useGetUserCreatedChallenges = (userAddress) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getUserCreatedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useGetUserCompletedChallenges = (userAddress) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getUserCompletedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useCreateChallenge = () => {
  const { writeContract, data: hash, isLoading, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createChallenge = async (params) => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'createChallenge',
      ...params, // includes args and value
    });
  };

  return {
    createChallenge,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    hash,
  };
};

export const useCompleteChallenge = () => {
  const { config } = useSimulateContract({
    ...CONTRACT_CONFIG,
    functionName: 'completeChallenge',
  });

  const { data, write, isLoading, error } = useWriteContract(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    completeChallenge: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  };
};

export const useEditChallenge = () => {
  const { config } = useSimulateContract({
    ...CONTRACT_CONFIG,
    functionName: 'editChallenge',
  });

  const { data, write, isLoading, error } = useWriteContract(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    editChallenge: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  };
};

export const useDeleteChallenge = () => {
  const { config } = useSimulateContract({
    ...CONTRACT_CONFIG,
    functionName: 'deleteChallenge',
  });

  const { data, write, isLoading, error } = useWriteContract(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    deleteChallenge: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  };
};

export const useRefundCreator = () => {
  const { config } = useSimulateContract({
    ...CONTRACT_CONFIG,
    functionName: 'refundCreator',
  });

  const { data, write, isLoading, error } = useWriteContract(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    refundCreator: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  };
};

export const createChallengeParams = (title, description, creatorNickname, reward, deadline, maxParticipants) => {
  try {
    const rewardInWei = parseEther(reward.toString());
    const totalValue = rewardInWei * BigInt(maxParticipants);
    
    console.log('Creating challenge params:', {
      title,
      description,
      creatorNickname,
      reward,
      rewardInWei: rewardInWei.toString(),
      deadline,
      maxParticipants,
      totalValue: totalValue.toString()
    });
    
    return {
      args: [title, description, creatorNickname, rewardInWei, deadline, maxParticipants],
      value: totalValue,
    };
  } catch (error) {
    console.error('Error creating challenge params:', error);
    throw new Error(`Failed to create challenge parameters: ${error.message}`);
  }
};


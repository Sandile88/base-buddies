'use client';

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_CONFIG } from './contract';
import { parseEther } from 'viem';

export const useGetAllChallenges = () => {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getAllChallenges',
  });
};

export const useGetChallenge = (challengeId) => {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getChallenge',
    args: [challengeId],
    enabled: challengeId !== undefined,
  });
};

export const useGetUserCreatedChallenges = (userAddress) => {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getUserCreatedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useGetUserCompletedChallenges = (userAddress) => {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getUserCompletedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useCreateChallenge = () => {
  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'createChallenge',
  });

  const { data, write, isLoading, error } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    createChallenge: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  };
};

export const useCompleteChallenge = () => {
  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'completeChallenge',
  });

  const { data, write, isLoading, error } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
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
  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'editChallenge',
  });

  const { data, write, isLoading, error } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
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
  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'deleteChallenge',
  });

  const { data, write, isLoading, error } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
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
  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'refundCreator',
  });

  const { data, write, isLoading, error } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
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
  const rewardInWei = parseEther(reward.toString());
  const totalValue = rewardInWei * BigInt(maxParticipants);
  
  return {
    args: [title, description, creatorNickname, rewardInWei, deadline, maxParticipants],
    value: totalValue,
  };
}; 


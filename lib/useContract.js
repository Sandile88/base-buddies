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

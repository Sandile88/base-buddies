'use client';

import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { CONTRACT_CONFIG } from './contract';
import { parseEther } from 'viem';

const CHAIN_ID = baseSepolia.id;

export const useGetAllChallenges = () => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    chainId: CHAIN_ID,
    functionName: 'getAllChallenges',
  });
};

export const useGetChallenge = (challengeId) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    chainId: CHAIN_ID,
    functionName: 'getChallenge',
    args: [challengeId],
    enabled: challengeId !== undefined,
  });
};

export const useGetUserCreatedChallenges = (userAddress) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    chainId: CHAIN_ID,
    functionName: 'getUserCreatedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useGetUserCompletedChallenges = (userAddress) => {
  return useReadContract({
    ...CONTRACT_CONFIG,
    chainId: CHAIN_ID,
    functionName: 'getUserCompletedChallenges',
    args: [userAddress],
    enabled: userAddress !== undefined,
  });
};

export const useCreateChallenge = () => {
  const { writeContract, data: hash, isLoading: isWriting, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const createChallenge = async (params) => {
    try {
      console.log('Calling writeContract with params:', params);
      
      await writeContract({
        ...CONTRACT_CONFIG,
        chainId: CHAIN_ID,
        functionName: 'createChallenge',
        ...params, // includes args and value
      });
    } catch (error) {
      console.error('Error in createChallenge writeContract:', error);
      throw error;
    }
  };

  // Combine errors from both write and receipt
  const error = writeError || receiptError;

  return {
    createChallenge,
    isLoading: isWriting || isConfirming,
    isSuccess,
    error,
    hash,
    isWriting,
    isConfirming,
  };
};

export const useCompleteChallenge = () => {
  const { writeContract, data: hash, isLoading: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    // hash: data?.hash,
      hash,

  });

  const completeChallenge = async (challengeId) => {
    console.log('Completing challenge with ID:', challengeId);
    try {
      writeContract({
        ...CONTRACT_CONFIG,
        chainId: CHAIN_ID,
        functionName: 'completeChallenge',
        args: [BigInt(challengeId)], 
      });
    } catch (error) {
      console.error('Error in completeChallenge:', error);
      throw error;
    }
  };

    const error = writeError || receiptError;


  return {
    completeChallenge,
    isLoading: isWriting || isConfirming,
    isSuccess,
    error,
    hash,
  };
};


export const useEditChallenge = () => {
  const { writeContract, data: hash, isLoading: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const editChallenge = async (params) => {
    try {
      await writeContract({
        ...CONTRACT_CONFIG,
        chainId: CHAIN_ID,
        functionName: 'editChallenge',
        ...params,
      });
    } catch (error) {
      console.error('Error in editChallenge:', error);
      throw error;
    }
  };

  const error = writeError || receiptError;

  return {
    editChallenge,
    isLoading: isWriting || isConfirming,
    isSuccess,
    error,
    hash,
  };
};

export const useDeleteChallenge = () => {
  const { writeContract, data: hash, isLoading: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const deleteChallenge = async (params) => {
    try {
      await writeContract({
        ...CONTRACT_CONFIG,
        chainId: CHAIN_ID,
        functionName: 'deleteChallenge',
        ...params,
      });
    } catch (error) {
      console.error('Error in deleteChallenge:', error);
      throw error;
    }
  };

  const error = writeError || receiptError;

  return {
    deleteChallenge,
    isLoading: isWriting || isConfirming,
    isSuccess,
    error,
    hash,
  };
};


export const useRefundCreator = () => {
  const { writeContract, data: hash, isLoading: isWriting, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const refundCreator = async (challengeId) => {
    console.log('Refunding creator for challenge ID:', challengeId);
    try {
      await writeContract({
        ...CONTRACT_CONFIG,
        chainId: CHAIN_ID,
        functionName: 'refundCreator',
        args: [BigInt(challengeId)],
      });
    } catch (error) {
      console.error('Error in refundCreator:', error);
      throw error;
    }
  };

  const error = writeError || receiptError;

  return {
    refundCreator,
    isLoading: isWriting || isConfirming,
    isSuccess,
    error,
    hash,
  };
};

export const createChallengeParams = (title, description, creatorNickname, reward, deadline, maxParticipants) => {
  try {
    // Validate inputs
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    
    if (typeof reward !== 'number' || isNaN(reward) || reward <= 0) {
      throw new Error(`Invalid reward amount: ${reward}. Must be a positive number.`);
    }
    
    if (typeof maxParticipants !== 'number' || isNaN(maxParticipants) || maxParticipants <= 0) {
      throw new Error(`Invalid max participants: ${maxParticipants}. Must be a positive integer.`);
    }

    console.log('Input validation passed:', { title, description, creatorNickname, reward, deadline, maxParticipants });

    
    const rewardInWei = parseEther(reward.toString());
    const totalValue = rewardInWei * BigInt(maxParticipants);
    
    console.log('Creating challenge params:', {
      title,
      description,
      creatorNickname: creatorNickname || 'Anonymous',
      reward,
      rewardInWei: rewardInWei.toString(),
      deadline,
      maxParticipants,
      totalValue: totalValue.toString()
    });
    
    return {
      args: [title, description, creatorNickname || 'Anonymous', rewardInWei, BigInt(deadline), BigInt(maxParticipants)],
      value: totalValue,
    };
  } catch (error) {
    console.error('Error creating challenge params:', error);
    throw new Error(`Failed to create challenge parameters: ${error.message}`);
  }
};

export const editChallengeParams = (challengeId, title, description, reward, deadline, ) => {
  try {
    // Validate inputs
    if (challengeId === undefined || challengeId === null) {
      throw new Error('Challenge ID is required');
    }
    
    if (!title || !description) {
      throw new Error('Title and description are required');
    }

    if (typeof reward !== 'number' || isNaN(reward) || reward <= 0) {
      throw new Error(`Invalid reward amount: ${reward}. Must be a positive number.`);
    }

    if (typeof deadline !== 'number' || isNaN(deadline) || deadline <= 0) {
      throw new Error(`Invalid deadline: ${deadline}. Must be a valid timestamp.`);
    }

    const rewardInWei = parseEther(reward.toString());

    console.log('Creating edit challenge params:', {
      challengeId,
      title,
      description,
      reward,
      rewardInWei: rewardInWei.toString(),
      deadline
    });
    
    return {
      args: [BigInt(challengeId), title, description, rewardInWei, BigInt(deadline)]
    };
  } catch (error) {
    console.error('Error creating edit challenge params:', error);
    throw new Error(`Failed to create edit challenge parameters: ${error.message}`);
  }
};


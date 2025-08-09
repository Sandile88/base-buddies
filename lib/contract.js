import CONTRACT_ABI from './abi.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const CONTRACT_ABI_EXPORT = CONTRACT_ABI;

export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI_EXPORT,
}; 
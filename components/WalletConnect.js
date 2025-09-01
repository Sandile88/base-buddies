'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Wallet, LogOut, User, Copy, Check } from 'lucide-react';

export default function WalletConnect({ fullWidth = false, size = 'md' }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Set frame ready when component mounts
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Try to connect with the first available connector (usually Farcaster)
      if (connectors.length > 0) {
        await connect({ connector: connectors[0], chainId: baseSepolia.id });
        try {
          await switchChainAsync({ chainId: baseSepolia.id });
        } catch (_) {}
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && chainId !== baseSepolia.id) {
      switchChainAsync({ chainId: baseSepolia.id }).catch(() => {});
    }
  }, [isConnected, chainId, switchChainAsync]);

  const handleDisconnect = () => {
    disconnect();
  };

   // Copy address functionality
  const copyAddressToClipboard = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const sizeClass = size === 'lg' ? 'h-12 px-6 text-base' : 'px-6 py-2';

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-3">
           {/* Clickable Address Display */}
          <button
            onClick={copyAddressToClipboard}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary-200 hover:bg-white/90 hover:border-primary-300 transition-all cursor-pointer"
            title="Click to copy full address"
          >
            <User className="w-4 h-4 text-secondary-600" />
            <span className="text-sm font-medium text-secondary-800">
              {copiedAddress ? 'Copied!' : formatAddress(address)}
            </span>
            {copiedAddress && <Check className="w-4 h-4 text-green-600" />}
          </button>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${widthClass} ${sizeClass}`}
        >
          <Wallet className="w-4 h-4" />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
} 
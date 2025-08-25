import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/LandingPage';
import MainApp from '../components/MainApp';
import { multiWalletService } from '../services/multiWalletService';
import { toast } from '../hooks/use-toast';

const Index = () => {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  console.log('Index component rendered, showLanding:', showLanding, 'walletInfo:', walletInfo); // Debug log

  useEffect(() => {
    // Check if wallet is already connected on component mount
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      console.log('Checking wallet connection...');
      const info = await multiWalletService.getCurrentWalletInfo();
      console.log('Wallet info received:', info);
      if (info?.isConnected) {
        setWalletInfo(info);
        setShowLanding(false);
        console.log('Wallet already connected, showing main app');
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const handleConnectWallet = async () => {
    console.log('Connect wallet button clicked - this should open wallet selector');
    // This function is now just a placeholder since the actual connection
    // happens in the LandingPage component through the wallet selector
    // The wallet selector will call onConnectWallet when connection is successful
  };

  const handleLaunchApp = async () => {
    console.log('Launch app button clicked - this should open wallet selector');
    // This function is now just a placeholder since the actual connection
    // happens in the LandingPage component through the wallet selector
    // The wallet selector will call onConnectWallet when connection is successful
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...');
      await multiWalletService.disconnectWallet();
      setWalletInfo(null);
      setShowLanding(true);
      toast({
        title: "Wallet Disconnected",
        description: "You have been returned to the landing page.",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // This function is called by the LandingPage when a wallet is successfully connected
  const handleWalletConnected = (walletInfo: any) => {
    console.log('Wallet connected successfully in Index:', walletInfo);
    setWalletInfo(walletInfo);
    setShowLanding(false);
    toast({
      title: "🎉 Wallet Connected Successfully!",
      description: `Welcome to GreyGuard Trials! You can now access the full application.`,
    });
  };

  // This function is called by the LandingPage when wallet connection is requested
  const handleWalletConnectionRequest = () => {
    console.log('Wallet connection requested - opening wallet selector');
    // The wallet selector will be opened by the LandingPage component
  };

  if (showLanding || !walletInfo?.isConnected) {
    return (
      <LandingPage 
        onConnectWallet={handleWalletConnectionRequest}
        onLaunchApp={handleWalletConnectionRequest}
        isConnecting={isConnecting}
        onWalletConnected={handleWalletConnected}
      />
    );
  }

  return (
    <MainApp 
      walletInfo={walletInfo}
      onDisconnect={handleDisconnect}
    />
  );
};

export default Index;
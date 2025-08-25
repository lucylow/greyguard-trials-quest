import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/LandingPage';
import MainApp from '../components/MainApp';
import { icpWalletService, ICPWalletInfo } from '../services/icpWalletService';
import { toast } from '../hooks/use-toast';

const Index = () => {
  const [walletInfo, setWalletInfo] = useState<ICPWalletInfo | null>(null);
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
      const info = await icpWalletService.getWalletInfo();
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
    console.log('Connect wallet button clicked');
    setIsConnecting(true);
    
    try {
      console.log('Attempting to connect to wallet...');
      
      // Check if Plug is installed first
      const isPlugInstalled = icpWalletService.isPlugInstalled();
      if (!isPlugInstalled) {
        console.log('Plug not installed, requesting installation');
        icpWalletService.requestInstall();
        toast({
          title: "Plug Wallet Required",
          description: "Please install the Plug wallet extension first, then try again.",
          variant: "destructive",
        });
        return;
      }

      const info = await icpWalletService.connect();
      console.log('Connection result:', info);
      
      if (info?.isConnected) {
        console.log('Wallet connected successfully:', info);
        setWalletInfo(info);
        setShowLanding(false);
        toast({
          title: "🎉 Wallet Connected Successfully!",
          description: `Welcome to GreyGuard Trials! You can now access the full application.`,
        });
      } else {
        console.log('Connection failed - no info returned');
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please check if Plug is unlocked and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred while connecting",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLaunchApp = async () => {
    console.log('Launch app button clicked');
    // This will trigger the wallet connection flow
    await handleConnectWallet();
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...');
      await icpWalletService.disconnect();
      setWalletInfo(null);
      setShowLanding(true);
      toast({
        title: "Wallet Disconnected",
        description: "You have been returned to the landing page.",
      });
    } catch (error) {
      console.error('Disconnection error:', error);
      toast({
        title: "Disconnection Error",
        description: "An error occurred while disconnecting",
        variant: "destructive",
      });
    }
  };

  // Show landing page if no wallet is connected
  if (showLanding || !walletInfo?.isConnected) {
    return (
      <LandingPage 
        onConnectWallet={handleConnectWallet}
        onLaunchApp={handleLaunchApp}
        isConnecting={isConnecting}
      />
    );
  }

  // Show main app if wallet is connected
  return (
    <MainApp 
      walletInfo={walletInfo}
      onDisconnect={handleDisconnect}
    />
  );
};

export default Index;
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
      const info = await icpWalletService.getWalletInfo();
      if (info?.isConnected) {
        setWalletInfo(info);
        setShowLanding(false);
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const info = await icpWalletService.connect();
      if (info?.isConnected) {
        setWalletInfo(info);
        setShowLanding(false);
        toast({
          title: "Wallet Connected!",
          description: `Welcome! You can now access the full application.`,
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLaunchApp = () => {
    // This will trigger the wallet connection flow
    handleConnectWallet();
  };

  const handleDisconnect = async () => {
    try {
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
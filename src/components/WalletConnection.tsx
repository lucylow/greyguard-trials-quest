import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Download, 
  User, 
  Coins,
  LogOut,
  Settings
} from 'lucide-react';
import { icpWalletService, ICPWalletInfo } from '../services/icpWalletService';
import { toast } from '../hooks/use-toast';

interface WalletConnectionProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function WalletConnection({ className, variant = 'default' }: WalletConnectionProps) {
  const [walletInfo, setWalletInfo] = useState<ICPWalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPlugInstalled, setIsPlugInstalled] = useState(false);

  useEffect(() => {
    // Check if Plug is installed on component mount
    const checkPlugInstallation = () => {
      const installed = icpWalletService.isPlugInstalled();
      setIsPlugInstalled(installed);
      
      if (installed) {
        // Check if already connected
        checkWalletConnection();
      }
    };

    checkPlugInstallation();

    // Check periodically for Plug installation
    const interval = setInterval(checkPlugInstallation, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkWalletConnection = async () => {
    try {
      const info = await icpWalletService.getWalletInfo();
      setWalletInfo(info);
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const handleConnect = async () => {
    if (!isPlugInstalled) {
      icpWalletService.requestInstall();
      return;
    }

    setIsConnecting(true);
    try {
      const info = await icpWalletService.connect();
      if (info) {
        setWalletInfo(info);
        toast({
          title: "Wallet Connected!",
          description: `Connected to ${info.walletName}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Plug wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await icpWalletService.disconnect();
      setWalletInfo(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Plug wallet",
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

  const handleInstallPlug = () => {
    icpWalletService.requestInstall();
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 10) return principal;
    return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
  };

  if (variant === 'compact') {
    if (walletInfo?.isConnected) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              {formatPrincipal(walletInfo.principal)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Plug Wallet
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-mono text-xs">{walletInfo.principal}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span>Balance: {walletInfo.balance || '0.0'} ICP</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isPlugInstalled ? (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Install Plug
          </>
        )}
      </Button>
    );
  }

  // Default variant
  if (walletInfo?.isConnected) {
    return (
      <div className={`flex items-center space-x-3 ${className || ''}`}>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
        <div className="flex items-center space-x-2">
          <Wallet className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-white">
            {formatPrincipal(walletInfo.principal)}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-slate-700 text-white border-slate-500 hover:bg-slate-600"
          onClick={handleDisconnect}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      {!isPlugInstalled && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Download className="h-3 w-3 mr-1" />
          Plug Required
        </Badge>
      )}
      
      <Button 
        variant="outline" 
        className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700"
        onClick={isPlugInstalled ? handleConnect : handleInstallPlug}
        disabled={isConnecting}
      >
        {isPlugInstalled ? (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Install Plug
          </>
        )}
      </Button>
    </div>
  );
}

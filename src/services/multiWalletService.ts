import { ICPWallet } from '../components/WalletSelector';

export interface WalletConnectionResult {
  success: boolean;
  walletInfo?: {
    principal: string;
    accountId: string;
    isConnected: boolean;
    balance?: string;
    walletName: string;
  };
  error?: string;
}

export class MultiWalletService {
  private static instance: MultiWalletService;
  private currentWallet: string | null = null;

  public static getInstance(): MultiWalletService {
    if (!MultiWalletService.instance) {
      MultiWalletService.instance = new MultiWalletService();
    }
    return MultiWalletService.instance;
  }

  // Get all supported ICP wallets
  public getSupportedWallets(): ICPWallet[] {
    return [
      {
        id: 'plug',
        name: 'Plug Wallet',
        description: 'Popular browser extension wallet for ICP',
        icon: 'https://plugwallet.ooo/assets/images/plug-logo.svg',
        url: 'https://plugwallet.ooo/',
        isInstalled: this.isPlugInstalled(),
        isConnected: this.isPlugConnected()
      },
      {
        id: 'internet-identity',
        name: 'Internet Identity',
        description: 'Official ICP authentication system',
        icon: 'https://internetcomputer.org/img/IC_logo_horizontal.svg',
        url: 'https://internetcomputer.org/internet-identity',
        isInstalled: this.isInternetIdentityAvailable(),
        isConnected: this.isInternetIdentityConnected()
      },
      {
        id: 'astrox',
        name: 'AstroX ME',
        description: 'Mobile-first ICP wallet',
        icon: 'https://astrox.me/assets/images/logo.svg',
        url: 'https://astrox.me/',
        isInstalled: this.isAstroXAvailable(),
        isConnected: this.isAstroXConnected()
      },
      {
        id: 'stoic',
        name: 'Stoic Wallet',
        description: 'Web-based ICP wallet',
        icon: 'https://www.stoicwallet.com/favicon.ico',
        url: 'https://www.stoicwallet.com/',
        isInstalled: this.isStoicAvailable(),
        isConnected: this.isStoicConnected()
      }
    ];
  }

  // Check if Plug wallet is installed
  private isPlugInstalled(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ic?.plug;
  }

  // Check if Plug wallet is connected
  private isPlugConnected(): boolean {
    if (!this.isPlugInstalled()) return false;
    try {
      return !!(window as any).ic?.plug?.isConnected?.();
    } catch {
      return false;
    }
  }

  // Check if Internet Identity is available
  private isInternetIdentityAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ic?.internetIdentity;
  }

  // Check if Internet Identity is connected
  private isInternetIdentityConnected(): boolean {
    if (!this.isInternetIdentityAvailable()) return false;
    try {
      return !!(window as any).ic?.internetIdentity?.isConnected?.();
    } catch {
      return false;
    }
  }

  // Check if AstroX is available
  private isAstroXAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ic?.astrox;
  }

  // Check if AstroX is connected
  private isAstroXConnected(): boolean {
    if (!this.isAstroXAvailable()) return false;
    try {
      return !!(window as any).ic?.astrox?.isConnected?.();
    } catch {
      return false;
    }
  }

  // Check if Stoic is available
  private isStoicAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ic?.stoic;
  }

  // Check if Stoic is connected
  private isStoicConnected(): boolean {
    if (!this.isStoicAvailable()) return false;
    try {
      return !!(window as any).ic?.stoic?.isConnected?.();
    } catch {
      return false;
    }
  }

  // Connect to a specific wallet
  public async connectWallet(walletId: string): Promise<WalletConnectionResult> {
    try {
      switch (walletId) {
        case 'plug':
          return await this.connectPlugWallet();
        case 'internet-identity':
          return await this.connectInternetIdentity();
        case 'astrox':
          return await this.connectAstroXWallet();
        case 'stoic':
          return await this.connectStoicWallet();
        default:
          return {
            success: false,
            error: `Unsupported wallet: ${walletId}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Connect to Plug wallet
  private async connectPlugWallet(): Promise<WalletConnectionResult> {
    if (!this.isPlugInstalled()) {
      return {
        success: false,
        error: 'Plug wallet is not installed. Please install it first.'
      };
    }

    try {
      const plug = (window as any).ic.plug;
      
      // Check if already connected
      const isConnected = await plug.isConnected();
      if (isConnected) {
        const principal = await plug.getPrincipal();
        const accountId = await plug.getAccountId();
        
        return {
          success: true,
          walletInfo: {
            principal: principal.toString(),
            accountId: accountId || '',
            isConnected: true,
            walletName: 'Plug Wallet'
          }
        };
      }

      // Request connection
      const connected = await plug.requestConnect({
        whitelist: [],
        host: 'https://mainnet.dfinity.network'
      });

      if (connected) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const principal = await plug.getPrincipal();
        const accountId = await plug.getAccountId();
        
        this.currentWallet = 'plug';
        
        return {
          success: true,
          walletInfo: {
            principal: principal.toString(),
            accountId: accountId || '',
            isConnected: true,
            walletName: 'Plug Wallet'
          }
        };
      }

      return {
        success: false,
        error: 'Failed to connect to Plug wallet'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Plug wallet'
      };
    }
  }

  // Connect to Internet Identity
  private async connectInternetIdentity(): Promise<WalletConnectionResult> {
    if (!this.isInternetIdentityAvailable()) {
      return {
        success: false,
        error: 'Internet Identity is not available'
      };
    }

    try {
      // Internet Identity connection logic would go here
      // This is a placeholder for the actual implementation
      return {
        success: false,
        error: 'Internet Identity connection not yet implemented'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Internet Identity'
      };
    }
  }

  // Connect to AstroX wallet
  private async connectAstroXWallet(): Promise<WalletConnectionResult> {
    if (!this.isAstroXAvailable()) {
      return {
        success: false,
        error: 'AstroX wallet is not available'
      };
    }

    try {
      // AstroX connection logic would go here
      // This is a placeholder for the actual implementation
      return {
        success: false,
        error: 'AstroX wallet connection not yet implemented'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to AstroX wallet'
      };
    }
  }

  // Connect to Stoic wallet
  private async connectStoicWallet(): Promise<WalletConnectionResult> {
    if (!this.isStoicAvailable()) {
      return {
        success: false,
        error: 'Stoic wallet is not available'
      };
    }

    try {
      // Stoic connection logic would go here
      // This is a placeholder for the actual implementation
      return {
        success: false,
        error: 'Stoic wallet connection not yet implemented'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Stoic wallet'
      };
    }
  }

  // Disconnect from current wallet
  public async disconnectWallet(): Promise<void> {
    if (!this.currentWallet) return;

    try {
      switch (this.currentWallet) {
        case 'plug':
          if (this.isPlugInstalled()) {
            await (window as any).ic.plug.disconnect();
          }
          break;
        // Add other wallet disconnection logic here
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      this.currentWallet = null;
    }
  }

  // Get current wallet info
  public async getCurrentWalletInfo() {
    if (!this.currentWallet) return null;

    try {
      switch (this.currentWallet) {
        case 'plug':
          if (this.isPlugInstalled() && this.isPlugConnected()) {
            const plug = (window as any).ic.plug;
            const principal = await plug.getPrincipal();
            const accountId = await plug.getAccountId();
            
            return {
              principal: principal.toString(),
              accountId: accountId || '',
              isConnected: true,
              walletName: 'Plug Wallet'
            };
          }
          break;
        // Add other wallet info retrieval logic here
      }
    } catch (error) {
      console.error('Error getting wallet info:', error);
    }

    return null;
  }

  // Refresh wallet status
  public refreshWalletStatus(): void {
    // This method can be called to refresh the status of all wallets
    // Useful for detecting newly installed wallets
  }
}

export const multiWalletService = MultiWalletService.getInstance();

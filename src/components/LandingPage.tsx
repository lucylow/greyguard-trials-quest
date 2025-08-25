import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletSelector, ICPWallet } from './WalletSelector';
import { WalletDebug } from './WalletDebug';
import { multiWalletService } from '../services/multiWalletService';
import { 
  Shield, 
  Lock, 
  Brain, 
  Activity, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Users,
  Globe,
  MessageSquare,
  TrendingUp,
  Wallet,
  Zap,
  Database,
  LockKeyhole,
  Star,
  Award,
  Heart,
  Zap as Lightning,
  Network,
  Cpu,
  Server,
  Layers,
  Hexagon,
  CircuitBoard
} from 'lucide-react';

interface LandingPageProps {
  onConnectWallet: () => void;
  onLaunchApp: () => void;
  isConnecting: boolean;
  onWalletConnected: (walletInfo: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnectWallet, onLaunchApp, isConnecting, onWalletConnected }) => {
  console.log('LandingPage component rendered!'); // Debug log
  
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [wallets, setWallets] = useState<ICPWallet[]>([]);
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);

  // Get supported wallets when component mounts
  React.useEffect(() => {
    const supportedWallets = multiWalletService.getSupportedWallets();
    setWallets(supportedWallets);
  }, []);

  const handleWalletSelect = async (walletId: string) => {
    console.log('Selected wallet:', walletId);
    
    try {
      setConnectingWalletId(walletId);
      console.log('Attempting to connect to wallet:', walletId);
      const result = await multiWalletService.connectWallet(walletId);
      console.log('Connection result:', result);
      
      if (result.success && result.walletInfo) {
        console.log('Wallet connected successfully:', result.walletInfo);
        setShowWalletSelector(false);
        setConnectingWalletId(null);
        // Call the parent's onWalletConnected to update the app state
        onWalletConnected(result.walletInfo);
      } else {
        console.error('Wallet connection failed:', result.error);
        setConnectingWalletId(null);
        // Show error to user
        alert(`Wallet connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnectingWalletId(null);
      alert(`Error connecting wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleConnectWalletClick = () => {
    // Refresh wallet status before showing selector
    multiWalletService.refreshWalletStatus();
    const updatedWallets = multiWalletService.getSupportedWallets();
    setWallets(updatedWallets);
    setShowWalletSelector(true);
  };

  const handleLaunchAppClick = () => {
    // Launch app also opens wallet selector
    handleConnectWalletClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements - ICP themed */}
      <div className="absolute inset-0 overflow-hidden">
        {/* ICP Network Nodes Visualization */}
        <div className="absolute top-20 left-20 w-32 h-32 opacity-10">
          <div className="w-full h-full border-2 border-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute top-40 right-32 w-24 h-24 opacity-10">
          <div className="w-full h-full border-2 border-blue-500 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-32 left-32 w-28 h-28 opacity-10">
          <div className="w-full h-full border-2 border-purple-500 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg relative">
                <Shield className="h-7 w-7 text-white" />
                {/* ICP Network Indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">GreyGuard Trials</h1>
                <p className="text-sm text-slate-600">Decentralized Clinical Trial Matching</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                    <Network className="h-3 w-3 mr-1" />
                    ICP Network
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live on ICP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center space-y-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            {/* ICP Network Status */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Connected to Internet Computer Network</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Cpu className="h-3 w-3 mr-1" />
                    ICP
                  </Badge>
                </div>
              </div>
            </div>

            {/* Animated Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                {/* ICP Network Connections */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-orange-400 rounded-full"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-orange-400 rounded-full"></div>
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-4 h-2 bg-orange-400 rounded-full"></div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-4 h-2 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Revolutionize
                </span>
                <br />
                Clinical Trial Discovery
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Powered by AI agents and <span className="font-semibold text-orange-600">Internet Computer Protocol (ICP)</span> blockchain technology. 
                Find the perfect clinical trials while maintaining complete data privacy on the decentralized web.
              </p>
            </div>

            {/* ICP Network Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md border border-orange-200">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">Decentralized Canisters</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Chain Key Technology</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md border border-purple-200">
                <div className="flex items-center space-x-2">
                  <Hexagon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Web3 Native</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-md border border-orange-200">
                <LockKeyhole className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-md border border-orange-200">
                <Database className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">ICP Blockchain</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-md border border-orange-200">
                <Brain className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-xl px-10 py-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0 group"
              onClick={handleConnectWalletClick}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-3 h-7 w-7" />
                  Connect ICP Wallet
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-xl px-10 py-8 border-3 border-orange-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
              onClick={handleLaunchAppClick}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Lightning className="mr-3 h-7 w-7" />
                  Launch App
                </>
              )}
            </Button>
          </div>

          {/* ICP Network Status */}
          <div className="pt-8">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-orange-200 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700">Connected to ICP Mainnet</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Network className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose GreyGuard Trials?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience the future of clinical trial matching with cutting-edge technology and unwavering privacy protection on the Internet Computer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Advanced AI agents analyze your symptoms and medical history to find the most suitable clinical trials with unprecedented accuracy.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Privacy-First Design</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Zero-knowledge proofs and military-grade encryption ensure your health data never leaves your control.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">ICP Blockchain</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Built on Internet Computer Protocol for transparency, security, and global accessibility without intermediaries.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Patient-Centric</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Designed with patients in mind, making trial discovery simple, accessible, and empowering.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Get instant notifications about new trials and updates to existing ones, never miss an opportunity.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 border-l-4 border-l-orange-500">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Precision Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Advanced algorithms ensure you only see trials that are truly relevant to your specific condition.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20"></div>
          <CardContent className="relative p-16 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold mb-6">Ready to Find Your Clinical Trial?</h2>
            <p className="text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of patients who have already discovered the right trials for their conditions. 
              Connect your wallet to get started with secure, private clinical trial matching on the Internet Computer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-xl px-10 py-8 bg-white text-orange-600 hover:bg-slate-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                onClick={handleConnectWalletClick}
              >
                <Wallet className="mr-3 h-7 w-7" />
                Connect Wallet & Start
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-400 py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-lg">Built with care for patients worldwide</span>
          </div>
          <p className="text-base mb-6">
            Powered by Fetch.ai Agents & <span className="font-semibold text-orange-400">Internet Computer Protocol (ICP)</span> • 
            Your health data remains encrypted and under your control
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>HIPAA Compliant</span>
            </span>
            <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 text-green-400" />
              <span>GDPR Ready</span>
            </span>
            <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Lock className="h-4 w-4 text-blue-400" />
              <span>End-to-End Encrypted</span>
            </span>
            <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-orange-500/30">
              <Network className="h-4 w-4 text-orange-400" />
              <span>ICP Network</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Wallet Selector Modal */}
      <WalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onSelectWallet={handleWalletSelect}
        wallets={wallets}
        isConnecting={isConnecting}
        connectingWalletId={connectingWalletId}
      />

      {/* Debug Component - Remove in production */}
      <WalletDebug />
    </div>
  );
};

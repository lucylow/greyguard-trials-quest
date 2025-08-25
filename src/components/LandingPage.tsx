import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  LockKeyhole
} from 'lucide-react';

interface LandingPageProps {
  onConnectWallet: () => void;
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnectWallet, onLaunchApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">GreyGuard Trials</h1>
                <p className="text-sm text-slate-600">Decentralized Clinical Trial Matching</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              No more grey areas in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> clinical matching</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Decentralized Clinical Trial Matching powered by AI agents and Internet Computer Protocol (ICP) blockchain technology
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={onConnectWallet}
            >
              <Wallet className="mr-3 h-6 w-6" />
              Connect Plug Wallet
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              onClick={onLaunchApp}
            >
              <Zap className="mr-3 h-6 w-6" />
              Launch App
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <LockKeyhole className="h-4 w-4" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>ICP Blockchain</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Advanced AI agents analyze your symptoms and medical history to find the most suitable clinical trials
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Privacy-First Design</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Zero-knowledge proofs and encryption ensure your data never leaves your control
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Decentralized Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Built on Internet Computer Protocol for transparency, security, and global accessibility
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Patient-Centric</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Designed with patients in mind, making trial discovery simple and accessible
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Get instant notifications about new trials and updates to existing ones
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Precision Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Advanced algorithms ensure you only see trials that are truly relevant to your condition
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Clinical Trial?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of patients who have already discovered the right trials for their conditions. 
              Connect your wallet to get started with secure, private clinical trial matching.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-slate-100"
                onClick={onConnectWallet}
              >
                <Wallet className="mr-3 h-6 w-6" />
                Connect Wallet & Start
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Powered by Fetch.ai Agents & Internet Computer Protocol (ICP) • 
            Your health data remains encrypted and under your control
          </p>
        </div>
      </footer>
    </div>
  );
};

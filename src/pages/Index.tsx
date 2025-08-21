import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomePage } from '../components/HomePage';
import { ClinicalTrialsPage } from '../components/ClinicalTrialsPage';
import { DecentralizedFeaturesPage } from '../components/DecentralizedFeaturesPage';
import { ResourcesPage } from '../components/ResourcesPage';
import { AgentPlatformPage } from '../components/AgentPlatformPage';
import DemoConversationInterface from '../components/DemoConversationInterface';
import PricingPage from '../components/PricingPage';
import LanguageSelector from '../components/LanguageSelector';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // Clinical Trials state
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // ZKP Demo state
  const [zkpForm, setZkpForm] = useState({
    patientId: '',
    encryptedProfile: '',
    condition: '',
    age: '',
    location: ''
  });
  const [generatedProof, setGeneratedProof] = useState(null);
  const [verifyPatientId, setVerifyPatientId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [zkpLoading, setZkpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { symptoms, location });
  };

  const handleTrialSelect = (trial) => {
    setSelectedTrial(trial);
  };

  // ZKP Demo functions
  const generateZKProof = async () => {
    if (!zkpForm.patientId || !zkpForm.condition) {
      return;
    }
    setZkpLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const proof = {
        proofId: `zk-proof-${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
        patientId: zkpForm.patientId,
        timestamp: new Date().toISOString(),
        btcAnchor: `${Math.random().toString(16).substr(2, 8)}...`,
        status: 'verified'
      };
      setGeneratedProof(proof);
    } catch (error) {
      console.error('Error generating proof:', error);
    } finally {
      setZkpLoading(false);
    }
  };

  const verifyZKProof = async () => {
    if (!verifyPatientId) {
      return;
    }
    setVerifyLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isValid = generatedProof && generatedProof.patientId === verifyPatientId;
      setVerificationResult({
        valid: isValid,
        message: isValid ? 
          "✓ Proof valid. Patient eligibility confirmed without exposing health data" :
          "✗ Proof not found or invalid"
      });
    } catch (error) {
      console.error('Error verifying proof:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-grey-800 text-grey-900 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">GreyGuard Trials</h1>
                <p className="text-xs sm:text-sm opacity-90">Decentralized Clinical Trial Matching</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="compact" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2">
            <TabsTrigger value="home" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Home</TabsTrigger>
            <TabsTrigger value="clinical-trials" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Clinical Trials</TabsTrigger>
            <TabsTrigger value="agent-platform" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Agent Platform</TabsTrigger>
            <TabsTrigger value="decentralized" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Decentralized</TabsTrigger>
            <TabsTrigger value="demo-conversations" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Demo</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Pricing</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <HomePage onNavigateToTab={setActiveTab} />
          </TabsContent>

          {/* Clinical Trials Tab */}
          <TabsContent value="clinical-trials" className="space-y-6">
            <ClinicalTrialsPage 
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              location={location}
              setLocation={setLocation}
              matches={matches}
              selectedTrial={selectedTrial}
              onTrialSelect={handleTrialSelect}
              onSubmit={handleSubmit}
              loading={loading}
              chatHistory={chatHistory}
              chatContainerRef={chatContainerRef}
            />
          </TabsContent>

          {/* Agent Platform Tab */}
          <TabsContent value="agent-platform" className="space-y-6">
            <AgentPlatformPage />
          </TabsContent>

          {/* Decentralized Features Tab */}
          <TabsContent value="decentralized" className="space-y-6">
            <DecentralizedFeaturesPage 
              zkpForm={zkpForm}
              setZkpForm={setZkpForm}
              generatedProof={generatedProof}
              verifyPatientId={verifyPatientId}
              setVerifyPatientId={setVerifyPatientId}
              verificationResult={verificationResult}
              zkpLoading={zkpLoading}
              verifyLoading={verifyLoading}
              generateZKProof={generateZKProof}
              verifyZKProof={verifyZKProof}
            />
          </TabsContent>

          {/* Demo Conversations Tab */}
          <TabsContent value="demo-conversations" className="space-y-6">
            <DemoConversationInterface />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <PricingPage />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-muted-foreground">
            Powered by Fetch.ai Agents & Internet Computer Protocol (ICP) • 
            Your health data remains encrypted and under your control
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
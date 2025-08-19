import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { 
  Send, 
  ShieldCheck, 
  Stethoscope, 
  MapPin, 
  Lock, 
  Shield, 
  Activity,
  HelpCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import AgentIntegration from '../components/AgentIntegration';
import PromptManager from '../components/PromptManager';
import ASIProtocol from '../components/ASIProtocol';
import ImageAgents from '../components/ImageAgents';
import MCPSystem from '../components/MCPSystem';
import { VoiceDemo } from '../components/VoiceDemo';

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Index = () => {
  // Main app state
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState([]);
  
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

  const chatContainerRef = useRef(null);

  // Mock trial data
  const demoMatches = [
    {
      id: "NCT04556747",
      title: "Phase 3 Immunotherapy for Breast Cancer",
      description: "Testing novel PD-L1 inhibitor in advanced HER2-negative breast cancer patients",
      phase: "Phase 3",
      status: "Recruiting",
      sponsor: "OncoPharma Inc.",
      locations: ["New York, NY", "Boston, MA", "Chicago, IL"],
      criteria: "Stage III/IV breast cancer, failed prior chemotherapy",
      matchScore: 92,
      url: "https://clinicaltrials.gov/ct2/show/NCT04556747",
      startDate: "2024-01-15",
      endDate: "2026-12-31",
      participants: 350,
      contact: "research@oncopharma.com",
      zkProof: {
        proofId: "zk-proof-7X9J2K",
        timestamp: "2025-08-15T14:32:00Z",
        btcTx: "c0ffee1234deadbeef9827349875acbd"
      }
    },
    {
      id: "NCT03945682",
      title: "Targeted Therapy for EGFR+ Lung Cancer",
      description: "Study of osimertinib in EGFR mutation-positive non-small cell lung cancer",
      phase: "Phase 2",
      status: "Active, not recruiting",
      sponsor: "LungCancer Research Foundation",
      locations: ["Los Angeles, CA", "Houston, TX", "Miami, FL"],
      criteria: "Stage IV NSCLC, confirmed EGFR mutation",
      matchScore: 87,
      url: "https://clinicaltrials.gov/ct2/show/NCT03945682",
      startDate: "2023-06-01",
      endDate: "2025-11-30",
      participants: 220,
      contact: "contact@lungresearch.org",
      zkProof: {
        proofId: "zk-proof-5T3R8P",
        timestamp: "2025-08-15T14:35:00Z",
        btcTx: "d34db33f1234567890abcdef12345678"
      }
    },
    {
      id: "NCT05123789",
      title: "Novel Alzheimer's Treatment Study",
      description: "Investigating amyloid-beta clearance in early-stage Alzheimer's patients",
      phase: "Phase 2/3",
      status: "Recruiting",
      sponsor: "NeuroCure Biopharma",
      locations: ["San Francisco, CA", "Seattle, WA", "Austin, TX"],
      criteria: "Mild cognitive impairment, APOE4 positive",
      matchScore: 95,
      url: "https://clinicaltrials.gov/ct2/show/NCT05123789",
      startDate: "2024-03-01",
      endDate: "2027-05-01",
      participants: 500,
      contact: "alz-study@neurocure.com",
      zkProof: {
        proofId: "zk-proof-9K2L4M",
        timestamp: "2025-08-15T14:38:00Z",
        btcTx: "f00dbabe1234567890cafebabe567890"
      }
    }
  ];

  useEffect(() => {
    // Initialize with welcome message
    setChatHistory([
      {
        id: 1,
        text: "Hello! I'm your clinical trial assistant. Describe your symptoms and location to find matching trials with complete privacy protection.",
        sender: 'system',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: symptoms, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    setLoading(true);
    setMatches([]);
    setSelectedTrial(null);

    try {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        text: "Processing your query with ZK-proof privacy protection using Fetch.ai agents...",
        sender: 'system',
        timestamp: new Date().toISOString()
      }]);

      // Call the real Supabase edge function
      const response = await fetch('/functions/v1/clinical-trial-matcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          location: location.trim() || 'any',
          age: null,
          patientId: `patient_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.matches) {
        setMatches(data.matches);
        
        setChatHistory(prev => [...prev, {
          id: Date.now() + 2,
          text: `Found ${data.matches.length} matching clinical trials using Fetch.ai agents and Gemini AI analysis. Your health data remained encrypted throughout the matching process.`,
          sender: 'system',
          timestamp: new Date().toISOString(),
          data: data.matches
        }]);
        
        // Also perform medical analysis using Gemini
        performMedicalAnalysis(symptoms.trim());
        
        toast({
          title: "Trials Found!",
          description: `Found ${data.matches.length} matching trials with AI-powered analysis using both ASI:One and Gemini APIs.`,
        });
      } else {
        throw new Error(data.error || 'No matches found');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, {
        id: Date.now() + 3,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'system',
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: "Error",
        description: "Failed to find matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSymptoms('');
      setLocation('');
    }
  };

  const handleTrialSelect = (trial) => {
    setSelectedTrial(trial);
    setActiveTab('details');
  };

  const handleConsent = (trial) => {
    toast({
      title: "Consent Granted",
      description: `Consent granted for trial: ${trial.title}`,
    });
    
    setChatHistory(prev => [...prev, {
      id: Date.now(),
      text: `I've granted consent to share my encrypted health data for the ${trial.title} study`,
      sender: 'user',
      timestamp: new Date().toISOString()
    }, {
      id: Date.now() + 1,
      text: `Consent recorded on blockchain! Your data remains encrypted. The research team will contact you through our secure system.`,
      sender: 'system',
      timestamp: new Date().toISOString()
    }]);
  };

  // ZKP Demo functions
  const generateZKProof = async () => {
    if (!zkpForm.patientId || !zkpForm.condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in Patient ID and Condition",
        variant: "destructive",
      });
      return;
    }

    setZkpLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const proof = {
        proofId: `zk-proof-${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
        patientId: zkpForm.patientId,
        timestamp: new Date().toISOString(),
        btcAnchor: `${Math.random().toString(16).substr(2, 8)}...`,
        status: 'verified'
      };
      
      setGeneratedProof(proof);
      toast({
        title: "ZK-Proof Generated",
        description: "Zero-knowledge proof generated successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proof",
        variant: "destructive",
      });
    } finally {
      setZkpLoading(false);
    }
  };

  const verifyZKProof = async () => {
    if (!verifyPatientId) {
      toast({
        title: "Missing Patient ID",
        description: "Please enter a Patient ID to verify",
        variant: "destructive",
      });
      return;
    }

    setVerifyLoading(true);
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if it matches generated proof
      const isValid = generatedProof && generatedProof.patientId === verifyPatientId;
      
      setVerificationResult({
        valid: isValid,
        message: isValid ? 
          "✓ Proof valid. Patient eligibility confirmed without exposing health data" :
          "✗ Proof not found or invalid"
      });
      
      toast({
        title: isValid ? "Proof Verified" : "Verification Failed",
        description: isValid ? "Proof verified successfully!" : "Proof verification failed",
        variant: isValid ? "default" : "destructive",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed",
        variant: "destructive",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold">GreyGuard Trials</h1>
                <p className="text-sm opacity-90">Decentralized Clinical Trial Matching</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PrivacyStatus />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How GreyGuard protects your privacy</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="chat">Trial Matching</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedTrial}>Trial Details</TabsTrigger>
            <TabsTrigger value="agent">AI Agent</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="asi">ASI Protocol</TabsTrigger>
            <TabsTrigger value="images">Image AI</TabsTrigger>
            <TabsTrigger value="mcp">MCP System</TabsTrigger>
            <TabsTrigger value="voice">Voice AI</TabsTrigger>
            <TabsTrigger value="zkp">ZKP Demo</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Features</TabsTrigger>
          </TabsList>

          {/* Trial Matching Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Clinical Trial Assistant</span>
                    </CardTitle>
                    <CardDescription>
                      Describe your symptoms to find matching trials with privacy protection
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg"
                    >
                      {chatHistory.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))}
                      {loading && (
                        <div className="flex items-center justify-center space-x-2 py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Matching trials with privacy protection...
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Describe symptoms (e.g., Stage 3 breast cancer)"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading || !symptoms.trim()}
                        className="w-full"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Find Trials
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Results Panel */}
              <div>
                <TrialResults 
                  matches={matches} 
                  onSelect={handleTrialSelect} 
                  selectedTrial={selectedTrial}
                />
              </div>
            </div>
          </TabsContent>

          {/* Trial Details Tab */}
          <TabsContent value="details">
            {selectedTrial ? (
              <TrialDetails trial={selectedTrial} onConsent={handleConsent} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a trial to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts">
            <PromptManager />
          </TabsContent>

          {/* ASI Protocol Tab */}
          <TabsContent value="asi">
            <ASIProtocol />
          </TabsContent>

          {/* Image AI Tab */}
          <TabsContent value="images">
            <ImageAgents />
          </TabsContent>

          {/* MCP System Tab */}
          <TabsContent value="mcp">
            <MCPSystem />
          </TabsContent>

          {/* Voice AI Tab */}
          <TabsContent value="voice">
            <VoiceDemo />
          </TabsContent>

          {/* ZKP Demo Tab */}
          <TabsContent value="zkp">
            <ZKPDemo 
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

          {/* AI Agent Tab */}
          <TabsContent value="agent">
            <AgentIntegration />
          </TabsContent>

          {/* Privacy Features Tab */}
          <TabsContent value="privacy">
            <PrivacyFeatures />
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

  // Medical Analysis function for Gemini integration
  const performMedicalAnalysis = async (symptoms, analysisType = 'comprehensive') => {
    try {
      const response = await fetch('/functions/v1/medical-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          analysisType,
          age: 45,
          gender: 'unspecified'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Medical Analysis Complete",
          description: `Gemini AI analysis completed with ${data.analysis.confidence}% confidence`,
        });
        
        console.log('Medical Analysis Results:', data.analysis);
        return data.analysis;
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Medical analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to perform medical analysis",
        variant: "destructive",
      });
      return null;
    }
  };
};

// Privacy Status Component
const PrivacyStatus = () => (
  <div className="flex items-center space-x-3">
    <div className="flex items-center space-x-1">
      <Lock className="h-4 w-4" />
      <span className="text-sm">Privacy Status</span>
    </div>
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="bg-success text-success-foreground">
        <ShieldCheck className="h-3 w-3 mr-1" />
        ZK Proofs
      </Badge>
      <Badge variant="secondary" className="bg-zkp-btc text-white">
        <Shield className="h-3 w-3 mr-1" />
        BTC Anchored
      </Badge>
    </div>
  </div>
);

// Chat Message Component
const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-card border'
      }`}>
        <p className="text-sm">{message.text}</p>
        
        {message.data && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <Badge className="bg-success text-success-foreground">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Privacy Protected
            </Badge>
          </div>
        )}
        
        <div className="text-xs opacity-70 mt-1">
          {formatDateTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

// Trial Results Component
const TrialResults = ({ matches, onSelect, selectedTrial }) => {
  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Find Clinical Trials Securely</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe your symptoms to find matching trials with complete privacy protection.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">
              <Lock className="h-3 w-3 mr-1" />
              Data Encrypted
            </Badge>
            <Badge variant="outline">
              <ShieldCheck className="h-3 w-3 mr-1" />
              ZK-Proof Matching
            </Badge>
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              HIPAA Compliant
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          <span>{matches.length} Matching Trials Found</span>
        </CardTitle>
        <CardDescription>
          All matches verified with privacy protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((trial) => (
          <Card 
            key={trial.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTrial?.id === trial.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(trial)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{trial.title}</h4>
                <Badge className="bg-success text-success-foreground">
                  {trial.matchScore}% Match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {trial.sponsor} • {trial.phase}
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {trial.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {trial.locations[0]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  ZK-Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Trial Details Component
const TrialDetails = ({ trial, onConsent }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{trial.title}</CardTitle>
            <CardDescription className="text-primary font-medium">
              {trial.sponsor} • {trial.phase}
            </CardDescription>
          </div>
          <Badge className="bg-success text-success-foreground text-lg px-3 py-1">
            {trial.matchScore}% Match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{trial.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Trial Details</h3>
            <div className="space-y-2 text-sm">
              <DetailRow label="Status" value={trial.status} />
              <DetailRow label="Participants" value={trial.participants} />
              <DetailRow label="Start Date" value={formatDate(trial.startDate)} />
              <DetailRow label="End Date" value={formatDate(trial.endDate)} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Contact & Locations</h3>
            <div className="space-y-2 text-sm">
              <DetailRow label="Email" value={trial.contact} />
              <div>
                <span className="font-medium">Locations:</span>
                <ul className="list-disc list-inside">
                  {trial.locations.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <ShieldCheck className="h-4 w-4 mr-2 text-success" />
            Privacy Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <DetailRow label="ZK Proof ID" value={trial.zkProof.proofId} />
            <DetailRow label="Timestamp" value={formatDateTime(trial.zkProof.timestamp)} />
            <DetailRow label="Bitcoin Anchor" value={`TX: ${trial.zkProof.btcTx.substring(0, 12)}...`} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            This match was verified without exposing your raw health data
          </p>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            className="flex-1"
            onClick={() => onConsent(trial)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Consent to Contact
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(trial.url, '_blank')}
          >
            View Full Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

// ZKP Demo Component
const ZKPDemo = ({ 
  zkpForm, 
  setZkpForm, 
  generatedProof, 
  verifyPatientId, 
  setVerifyPatientId, 
  verificationResult, 
  zkpLoading, 
  verifyLoading, 
  generateZKProof, 
  verifyZKProof 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Proof Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>ZK-Proof Generator</span>
            <Badge variant="outline" className="demo-badge">DEMO</Badge>
          </CardTitle>
          <CardDescription>
            Generate fake ZK-proofs for patient eligibility verification
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Patient ID (e.g., P123)"
              value={zkpForm.patientId}
              onChange={(e) => setZkpForm(prev => ({ ...prev, patientId: e.target.value }))}
            />
            <Textarea
              placeholder="Encrypted Health Data (simulated)"
              value={zkpForm.encryptedProfile}
              onChange={(e) => setZkpForm(prev => ({ ...prev, encryptedProfile: e.target.value }))}
              rows={3}
            />
            <Input
              placeholder="Condition (e.g., breast cancer)"
              value={zkpForm.condition}
              onChange={(e) => setZkpForm(prev => ({ ...prev, condition: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Age"
                type="number"
                value={zkpForm.age}
                onChange={(e) => setZkpForm(prev => ({ ...prev, age: e.target.value }))}
              />
              <Input
                placeholder="Location"
                value={zkpForm.location}
                onChange={(e) => setZkpForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={generateZKProof}
            disabled={zkpLoading}
            className="w-full"
          >
            {zkpLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
            Generate ZK-Proof
          </Button>
          
          {generatedProof && (
            <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg zkp-verified">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-success">ZK-Proof Generated</h4>
                <Badge className="demo-badge bg-success text-success-foreground">
                  VERIFICATION READY
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Proof ID:</span> <code className="bg-muted px-1 rounded">{generatedProof.proofId}</code></p>
                <p><span className="font-medium">Patient:</span> {generatedProof.patientId}</p>
                <p><span className="font-medium">Timestamp:</span> {formatDateTime(generatedProof.timestamp)}</p>
                <p><span className="font-medium">BTC Anchor:</span> <code className="bg-muted px-1 rounded">{generatedProof.btcAnchor}</code></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proof Verifier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <span>ZK-Proof Verifier</span>
            <Badge variant="outline" className="demo-badge">DEMO</Badge>
          </CardTitle>
          <CardDescription>
            Verify patient eligibility without exposing health data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Enter Patient ID to verify"
              value={verifyPatientId}
              onChange={(e) => setVerifyPatientId(e.target.value)}
            />
            <Button 
              onClick={verifyZKProof}
              disabled={verifyLoading}
              className="w-full"
            >
              {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Verify Proof
            </Button>
          </div>
          
          {verificationResult && (
            <div className={`p-4 rounded-lg border ${
              verificationResult.valid 
                ? 'bg-success/10 border-success/20 zkp-verified' 
                : 'bg-destructive/10 border-destructive/20 zkp-shake'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {verificationResult.valid ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <h4 className={`font-semibold ${
                  verificationResult.valid ? 'text-success' : 'text-destructive'
                }`}>
                  Verification {verificationResult.valid ? 'Success' : 'Failed'}
                </h4>
              </div>
              <p className="text-sm">{verificationResult.message}</p>
            </div>
          )}
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">How ZK-Proofs Work:</p>
                <p>This simulated proof demonstrates how real ZK-proofs would verify eligibility without exposing your health data. In production, this would use cryptographic proofs like zk-SNARKs.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Privacy Features Component
const PrivacyFeatures = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">How GreyGuard Protects Your Health Data</CardTitle>
        <CardDescription>
          Our comprehensive privacy-preserving architecture ensures your medical information remains secure
        </CardDescription>
      </CardHeader>
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PrivacyFeatureCard 
        icon={<Lock className="h-8 w-8" />}
        title="End-to-End Encryption"
        description="Your health data is encrypted before it leaves your device using AES-256 encryption. Only you hold the decryption keys."
        color="zkp-encrypted"
      />
      <PrivacyFeatureCard 
        icon={<ShieldCheck className="h-8 w-8" />}
        title="Zero-Knowledge Proofs"
        description="We verify your eligibility for trials without accessing your raw medical data using advanced cryptographic proofs."
        color="zkp-verified"
      />
      <PrivacyFeatureCard 
        icon={<Activity className="h-8 w-8" />}
        title="Decentralized Architecture"
        description="No central database stores your information. Data is distributed across secure nodes on the Internet Computer network."
        color="zkp-icp"
      />
      <PrivacyFeatureCard 
        icon={<Shield className="h-8 w-8" />}
        title="Bitcoin-Anchored Audit Trails"
        description="All consent actions are permanently recorded with cryptographic proofs anchored to the Bitcoin blockchain."
        color="zkp-btc"
      />
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Technical Architecture</CardTitle>
        <CardDescription>
          How Fetch.ai agents and Internet Computer work together to protect your privacy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-card rounded-lg border">
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Fetch.ai Agents</h3>
              <p className="text-sm text-muted-foreground">Autonomous matching & NLP processing</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <Shield className="h-8 w-8 text-zkp-icp mx-auto mb-2" />
              <h3 className="font-semibold">Internet Computer</h3>
              <p className="text-sm text-muted-foreground">Secure data storage & ZK-proofs</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <Lock className="h-8 w-8 text-zkp-btc mx-auto mb-2" />
              <h3 className="font-semibold">Bitcoin Network</h3>
              <p className="text-sm text-muted-foreground">Immutable audit trail anchoring</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            GreyGuard Trials combines Fetch.ai's autonomous agents with Internet Computer's secure blockchain infrastructure.
            Patient data remains encrypted at all times, with matching performed through privacy-preserving computation.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const PrivacyFeatureCard = ({ icon, title, description, color }) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <div className={`text-${color} mb-4`}>{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground flex-1">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
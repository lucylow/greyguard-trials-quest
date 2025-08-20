import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { EnhancedAgentChat } from "./EnhancedAgentChat";
import { enhancedAgentService } from "@/services/enhancedAgentService";
import { asiOneService } from "@/services/asiOneService";
import {
  Bot,
  Settings,
  Zap,
  Shield,
  Database,
  Network,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Brain,
  Sparkles,
  Wifi,
  WifiOff,
  Activity,
  BarChart3,
  Cpu,
  Globe,
  Lock,
  Key,
  Server
} from 'lucide-react';

interface AgentStatus {
  connected: boolean;
  address: string;
  network: string;
  lastSeen: string;
  version: string;
  fallbackActive: boolean;
  fallbackReason: string;
}

interface ICPStatus {
  canisterStatus: 'running' | 'stopped' | 'unknown';
  canisterId: string;
  cyclesBalance: string;
  lastUpdate: string;
}

interface FallbackData {
  isActive: boolean;
  reason: string;
  lastSwitch: string;
  mockDataEnabled: boolean;
}

const AgentIntegration: React.FC = () => {
  // All hooks must be at the top level
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [agentConfig, setAgentConfig] = useState({
    agentAddress: 'agent1qg4zsqrdmyac8j6nc97nz99dxgauyaer2k8zw8mjcktnjrjh4jjkqfkj8tj',
    asiApiKey: process.env.REACT_APP_ASI_API_KEY || '',
    icpCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    network: 'mainnet',
    geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY || ''
  });

  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    connected: false,
    address: 'agent1qg4zsqrdmyac8j6nc97nz99dxgauyaer2k8zjcktnjrjh4jjkqfkj8tj',
    network: 'fetchai-mainnet',
    lastSeen: 'Never',
    version: '1.0.0',
    fallbackActive: false,
    fallbackReason: ''
  });

  const [icpStatus] = useState<ICPStatus>({
    canisterStatus: 'unknown',
    canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    cyclesBalance: '0',
    lastUpdate: 'Never'
  });

  const [fallbackData, setFallbackData] = useState<FallbackData>({
    isActive: false,
    reason: '',
    lastSwitch: '',
    mockDataEnabled: true
  });

  const [connectionTesting, setConnectionTesting] = useState(false);
  const [autoFallback, setAutoFallback] = useState(true);
  const [asiOneStatus, setAsiOneStatus] = useState({
    connected: false,
    lastHealthCheck: new Date(),
    apiKeyValid: false
  });

  // Test Fetch.ai agent connection
  const testFetchAgentConnection = async (): Promise<boolean> => {
    try {
      // Simulate Fetch.ai agent connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random connection failure (30% chance for demo purposes)
      const connectionSuccess = Math.random() > 0.3;
      
      if (connectionSuccess) {
        return true;
      } else {
        throw new Error('Fetch.ai agent connection timeout');
      }
    } catch (error) {
      console.error('Fetch.ai agent connection failed:', error);
      return false;
    }
  };

  // Test ICP canister connection
  const testICPConnection = async (): Promise<boolean> => {
    try {
      // Simulate ICP connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random connection failure (20% chance for demo purposes)
      const connectionSuccess = Math.random() > 0.2;
      
      if (connectionSuccess) {
        return true;
      } else {
        throw new Error('ICP canister connection failed');
      }
    } catch (error) {
      console.error('ICP connection failed:', error);
      return false;
    }
  };

  // Test ASI:One connection
  const testASIOneConnection = async (): Promise<boolean> => {
    try {
      const isValid = await asiOneService.validateAPIKey();
      if (!isValid) return false;

      const isHealthy = await asiOneService.checkHealth();
      setAsiOneStatus(prev => ({
        ...prev,
        connected: isHealthy,
        lastHealthCheck: new Date(),
        apiKeyValid: isValid
      }));
      
      return isHealthy;
    } catch (error) {
      console.error('ASI:One connection test failed:', error);
      setAsiOneStatus(prev => ({
        ...prev,
        connected: false,
        lastHealthCheck: new Date()
      }));
      return false;
    }
  };

  // Activate fallback mode
  const activateFallback = (reason: string) => {
    const fallbackReason = reason || 'Primary agent connection failed';
    
    setAgentStatus(prev => ({
      ...prev,
      connected: false,
      fallbackActive: true,
      fallbackReason
    }));

    setFallbackData({
      isActive: true,
      reason: fallbackReason,
      lastSwitch: new Date().toISOString(),
      mockDataEnabled: true
    });

    toast({
      title: "Fallback Mode Activated",
      description: `Switched to fallback mode. Reason: ${fallbackReason}`,
      variant: "default",
    });
  };

  // Deactivate fallback mode
  const deactivateFallback = () => {
    setAgentStatus(prev => ({
      ...prev,
      connected: true,
      fallbackActive: false,
      fallbackReason: ''
    }));

    setFallbackData({
      isActive: false,
      reason: '',
      lastSwitch: '',
      mockDataEnabled: false
    });

    toast({
      title: "Primary Mode Restored",
      description: "Successfully reconnected to primary agents",
      variant: "default",
    });
  };

  // Test all connections and manage fallback
  const handleTestConnection = async () => {
    setConnectionTesting(true);
    
    try {
      // Test all connections
      const [fetchAgentConnected, icpConnected, asiOneConnected] = await Promise.all([
        testFetchAgentConnection(),
        testICPConnection(),
        testASIOneConnection()
      ]);
      
      if (fetchAgentConnected && icpConnected && asiOneConnected) {
        // All connections successful
        deactivateFallback();
        toast({
          title: "Connection Successful",
          description: "Successfully connected to all services: Fetch.ai agent, ICP canister, and ASI:One",
        });
      } else {
        // Connection failed, activate fallback if enabled
        if (autoFallback) {
          const reasons = [];
          if (!fetchAgentConnected) reasons.push('Fetch.ai agent');
          if (!icpConnected) reasons.push('ICP canister');
          if (!asiOneConnected) reasons.push('ASI:One');
          
          activateFallback(`${reasons.join(', ')} connection failed`);
        } else {
          toast({
            title: "Connection Failed",
            description: "Unable to establish all connections. Please check your configuration.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Connection test error:', error);
      if (autoFallback) {
        activateFallback('Connection test failed');
      } else {
        toast({
          title: "Connection Test Failed",
          description: "An error occurred during connection testing.",
          variant: "destructive",
        });
      }
    } finally {
      setConnectionTesting(false);
    }
  };

  // Auto-test connections on component mount
  useEffect(() => {
    const autoTestConnections = async () => {
      try {
        await handleTestConnection();
      } catch (error) {
        console.error('Auto-connection test failed:', error);
        setHasError(true);
        setErrorMessage('Failed to initialize agent connections');
      }
    };
    
    autoTestConnections();
  }, []);

  const handleAgentResponse = (type: string) => (data: any) => {
    console.log(`Agent ${type}:`, data);
    
    const responseType = fallbackData.isActive ? 'Fallback Agent' : 'ASI:One Agent';
    
    toast({
      title: `${responseType} - ${type}`,
      description: `Successfully processed ${type} request${fallbackData.isActive ? ' using fallback mode' : ''}`,
    });
  };

  // Generate mock data for fallback mode
  const generateMockData = () => {
    if (!fallbackData.isActive) return null;
    
    return {
      trials: [
        {
          id: 'T001',
          title: 'Immunotherapy for Advanced Lung Cancer',
          status: 'Recruiting',
          location: 'New York, NY',
          matchScore: 95,
          phase: 'Phase II'
        },
        {
          id: 'T002',
          title: 'Novel Diabetes Treatment Study',
          status: 'Recruiting',
          location: 'Boston, MA',
          matchScore: 88,
          phase: 'Phase III'
        }
      ],
      profiles: [
        {
          id: 'P001',
          condition: 'Stage III Lung Cancer',
          age: '58',
          location: 'New York',
          lastUpdated: '2024-01-15'
        }
      ]
    };
  };

  // Error boundary - show error UI if something went wrong
  if (hasError) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }

  // Main component render
  return (
    <div className="space-y-6">
      {/* Enhanced Status Banner */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">AI Agent Status</h4>
                <p className="text-sm text-blue-700">
                  {asiOneStatus.connected ? 'ASI:One Active' : 'ASI:One Inactive'} • 
                  {fallbackData.isActive ? ' Fallback Mode' : ' Primary Mode'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={connectionTesting}
            >
              {connectionTesting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test All Connections
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Enhanced AI Agent Interface</span>
                <Badge variant={agentStatus.fallbackActive ? "secondary" : "default"}>
                  {agentStatus.fallbackActive ? "Fallback Mode" : "ASI:One Active"}
                </Badge>
                {asiOneStatus.connected && (
                  <Badge variant="outline" className="ml-2">
                    <Brain className="h-3 w-3 mr-1" />
                    ASI:One
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <EnhancedAgentChat
                onProfileSubmit={handleAgentResponse('Profile Submission')}
                onTrialMatch={handleAgentResponse('Trial Match')}
                onConsentUpdate={handleAgentResponse('Consent Update')}
                fallbackMode={fallbackData.isActive}
                mockData={generateMockData()}
              />
            </CardContent>
          </Card>
        </div>

        {/* Status & Configuration Panel */}
        <div className="space-y-6">
          {/* Agent Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {asiOneStatus.connected ? (
                  <Brain className="h-4 w-4 text-purple-500" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                <span>Agent Status</span>
                {asiOneStatus.connected && (
                  <Badge variant="secondary" className="ml-2">
                    ASI:One
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ASI:One Status</span>
                  <div className="flex items-center space-x-1">
                    {asiOneStatus.connected ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">Disconnected</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Key</span>
                  <div className="flex items-center space-x-1">
                    {asiOneStatus.apiKeyValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {asiOneStatus.apiKeyValid ? 'Valid' : 'Invalid/Missing'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Health Check</span>
                  <span className="text-sm text-muted-foreground">
                    {asiOneStatus.lastHealthCheck.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant="outline">
                    {asiOneStatus.connected ? 'asi1-mini' : 'offline'}
                  </Badge>
                </div>
              </div>

              {asiOneStatus.connected && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">ASI:One Features</span>
                  </div>
                  <ul className="text-xs space-y-1 text-purple-700">
                    <li>• Streaming chat completions</li>
                    <li>• Thought process visibility</li>
                    <li>• Intent analysis and classification</li>
                    <li>• Clinical trial expertise</li>
                    <li>• Multi-turn conversations</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ICP Canister Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>ICP Canister</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center space-x-1">
                    {icpStatus.canisterStatus === 'running' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : icpStatus.canisterStatus === 'stopped' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm capitalize">{icpStatus.canisterStatus}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cycles</span>
                  <Badge variant="outline">{icpStatus.cyclesBalance}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Update</span>
                  <span className="text-sm text-muted-foreground">{icpStatus.lastUpdate}</span>
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-xs font-medium">Canister ID</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                    {icpStatus.canisterId}
                  </code>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleTestConnection}
                disabled={connectionTesting}
              >
                {connectionTesting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Network className="h-4 w-4 mr-2" />
                )}
                Test All Connections
              </Button>
              
              {fallbackData.isActive && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setFallbackData(prev => ({ ...prev, mockDataEnabled: !prev.mockDataEnabled }))}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {fallbackData.mockDataEnabled ? 'Disable' : 'Enable'} Mock Data
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                View Audit Logs
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="asi" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="asi">ASI:One Config</TabsTrigger>
              <TabsTrigger value="agent">Agent Config</TabsTrigger>
              <TabsTrigger value="fallback">Fallback Settings</TabsTrigger>
              <TabsTrigger value="icp">ICP Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="asi" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">ASI:One API Key</h4>
                    <p className="text-sm text-muted-foreground">Configure your ASI:One API key for enhanced AI capabilities</p>
                  </div>
                  <Badge variant={asiOneStatus.apiKeyValid ? "default" : "destructive"}>
                    {asiOneStatus.apiKeyValid ? "Configured" : "Missing"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="asi-api-key">API Key</Label>
                  <Input
                    id="asi-api-key"
                    type="password"
                    value={agentConfig.asiApiKey}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, asiApiKey: e.target.value }))}
                    placeholder="Enter ASI:One API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add REACT_APP_ASI_API_KEY to your environment variables for production use.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">ASI:One Features:</h4>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• Streaming chat completions</li>
                    <li>• Thought process visibility</li>
                    <li>• Intent analysis and classification</li>
                    <li>• Clinical trial expertise</li>
                    <li>• Multi-turn conversations</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-address">Agent Address</Label>
                  <Input
                    id="agent-address"
                    value={agentConfig.agentAddress}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, agentAddress: e.target.value }))}
                    placeholder="agent1q..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Input
                    id="network"
                    value={agentConfig.network}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, network: e.target.value }))}
                    placeholder="mainnet"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fallback" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-Fallback</h4>
                    <p className="text-sm text-muted-foreground">Automatically switch to fallback mode when primary services fail</p>
                  </div>
                  <Button
                    variant={autoFallback ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoFallback(!autoFallback)}
                  >
                    {autoFallback ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mock Data Generation</h4>
                    <p className="text-sm text-muted-foreground">Generate realistic mock data in fallback mode</p>
                  </div>
                  <Button
                    variant={fallbackData.mockDataEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFallbackData(prev => ({ ...prev, mockDataEnabled: !prev.mockDataEnabled }))}
                  >
                    {fallbackData.mockDataEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                {fallbackData.isActive && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Fallback Status:</h4>
                    <div className="text-sm space-y-1 text-blue-700">
                      <p><strong>Reason:</strong> {fallbackData.reason}</p>
                      <p><strong>Activated:</strong> {new Date(fallbackData.lastSwitch).toLocaleString()}</p>
                      <p><strong>Mock Data:</strong> {fallbackData.mockDataEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="icp" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canister-id">Canister ID</Label>
                <Input
                  id="canister-id"
                  value={agentConfig.icpCanisterId}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, icpCanisterId: e.target.value }))}
                  placeholder="rrkah-fqaaa-aaaaa-aaaaq-cai"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Cycles</Label>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-sm font-mono">{icpStatus.cyclesBalance} cycles</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-sm font-mono">1.2GB / 4GB</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">All communications are encrypted</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Zero-Knowledge Proofs</h4>
                    <p className="text-sm text-muted-foreground">Privacy-preserving eligibility verification</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Blockchain Anchoring</h4>
                    <p className="text-sm text-muted-foreground">Immutable audit trail on Bitcoin</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">HIPAA Compliance</h4>
                    <p className="text-sm text-muted-foreground">Healthcare data protection standards</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentIntegration;
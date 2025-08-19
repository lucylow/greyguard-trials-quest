import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import AgentChat from "./AgentChat";
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
  ExternalLink
} from 'lucide-react';

interface AgentStatus {
  connected: boolean;
  address: string;
  network: string;
  lastSeen: string;
  version: string;
}

interface ICPStatus {
  canisterStatus: 'running' | 'stopped' | 'unknown';
  canisterId: string;
  cyclesBalance: string;
  lastUpdate: string;
}

const AgentIntegration: React.FC = () => {
  const [agentConfig, setAgentConfig] = useState({
    agentAddress: 'agent1qg4zsqrdmyac8j6nc97nz99dxgauyaer2k8zw8mjcktnjrjh4jjkqfkj8tj',
    asiApiKey: '',
    icpCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    network: 'mainnet'
  });

  const [agentStatus] = useState<AgentStatus>({
    connected: true,
    address: 'agent1qg4zsqrdmyac8j6nc97nz99dxgauyaer2k8zw8mjcktnjrjh4jjkqfkj8tj',
    network: 'fetchai-mainnet',
    lastSeen: '2 seconds ago',
    version: '1.0.0'
  });

  const [icpStatus] = useState<ICPStatus>({
    canisterStatus: 'running',
    canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    cyclesBalance: '2.5T',
    lastUpdate: '1 minute ago'
  });

  const [connectionTesting, setConnectionTesting] = useState(false);

  const handleTestConnection = async () => {
    setConnectionTesting(true);
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Fetch.ai agent and ICP canister",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to establish connection. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setConnectionTesting(false);
    }
  };

  const handleAgentResponse = (type: string) => (data: any) => {
    console.log(`Agent ${type}:`, data);
    toast({
      title: `Agent ${type}`,
      description: `Successfully processed ${type} request`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Agent Interface</span>
                <Badge variant={agentStatus.connected ? "default" : "destructive"}>
                  {agentStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <AgentChat
                onProfileSubmit={handleAgentResponse('Profile Submission')}
                onTrialMatch={handleAgentResponse('Trial Match')}
                onConsentUpdate={handleAgentResponse('Consent Update')}
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
                <Zap className="h-4 w-4" />
                <span>Agent Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant="outline">{agentStatus.network}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Seen</span>
                  <span className="text-sm text-muted-foreground">{agentStatus.lastSeen}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Version</span>
                  <span className="text-sm text-muted-foreground">{agentStatus.version}</span>
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-xs font-medium">Agent Address</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                    {agentStatus.address}
                  </code>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
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
                    <CheckCircle className="h-4 w-4 text-green-500" />
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
                Test Connections
              </Button>
              
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
          <Tabs defaultValue="agent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="agent">Agent Config</TabsTrigger>
              <TabsTrigger value="icp">ICP Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
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
                  <Label htmlFor="asi-key">ASI API Key</Label>
                  <Input
                    id="asi-key"
                    type="password"
                    value={agentConfig.asiApiKey}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, asiApiKey: e.target.value }))}
                    placeholder="Enter ASI API key"
                  />
                </div>
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
                    <span className="text-sm font-mono">2.5T cycles</span>
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
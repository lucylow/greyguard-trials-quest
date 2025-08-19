import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Shield, 
  Activity,
  Sparkles,
  Cpu,
  Network,
  Code,
  Lightbulb
} from 'lucide-react';
import AgentIntegration from './AgentIntegration';
import PromptManager from './PromptManager';
import ASIProtocol from './ASIProtocol';

export const AgentPlatformPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-agent');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Agent Platform</h1>
        <p className="text-muted-foreground">
          AI-powered assistance and protocol integration for clinical trial matching
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-agent">AI Agent</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="asi-protocol">ASI Protocol</TabsTrigger>
        </TabsList>

        {/* AI Agent Tab */}
        <TabsContent value="ai-agent" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Agent Overview
                  </CardTitle>
                  <CardDescription>
                    Interact with our intelligent assistant for personalized trial guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Powered by Fetch.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Privacy-First Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Real-Time Processing</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">What the AI Agent can do:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Analyze symptoms and medical history</li>
                      <li>• Find relevant clinical trials</li>
                      <li>• Explain trial requirements and eligibility</li>
                      <li>• Provide personalized recommendations</li>
                      <li>• Answer questions about the matching process</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <AgentIntegration />
            </div>
          </div>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Prompt Engineering
                  </CardTitle>
                  <CardDescription>
                    Use effective prompts to guide the AI agent's responses and get better results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
                    <ul className="text-sm space-y-1 text-blue-700">
                      <li>• Be specific about your condition and symptoms</li>
                      <li>• Include relevant medical history and treatments</li>
                      <li>• Mention your location and travel preferences</li>
                      <li>• Ask follow-up questions for clarification</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Example Prompts:</h4>
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>• "I have Stage 2 breast cancer, what trials are available?"</li>
                      <li>• "Show me diabetes trials within 50 miles of Boston"</li>
                      <li>• "What are the eligibility criteria for immunotherapy trials?"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <PromptManager />
            </div>
          </div>
        </TabsContent>

        {/* ASI Protocol Tab */}
        <TabsContent value="asi-protocol" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    ASI:One Integration
                  </CardTitle>
                  <CardDescription>
                    Learn about our integration with ASI:One for enhanced AI capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Enhanced AI Performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Standardized Protocols</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Secure Communication</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🔗 ASI Protocol Benefits:</h4>
                    <ul className="text-sm space-y-1 text-purple-700">
                      <li>• Interoperable AI agent communication</li>
                      <li>• Enhanced privacy and security standards</li>
                      <li>• Scalable architecture for future growth</li>
                      <li>• Industry-standard compliance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ASIProtocol />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Platform Features Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Sparkles className="h-5 w-5" />
            Platform Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Intelligent Matching</h4>
              <p className="text-sm text-blue-700">
                AI-powered analysis for precise clinical trial matching
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Natural Conversation</h4>
              <p className="text-sm text-purple-700">
                Chat naturally with AI agents for personalized assistance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Privacy Protected</h4>
              <p className="text-sm text-green-700">
                Your data remains secure with advanced encryption
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { fetchAgentService, FetchAgent, AgentMessage, PatientAnalysis, TrialAnalysis } from '../services/fetchAgentService';
import { 
  Bot, 
  MessageSquare, 
  Brain, 
  Target, 
  Activity, 
  CheckCircle, 
  Clock, 
  User,
  Send,
  Sparkles,
  Zap,
  Shield,
  Database,
  Network
} from 'lucide-react';

export const FetchAgentShowcase: React.FC = () => {
  const [agents, setAgents] = useState<FetchAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PatientAnalysis | TrialAnalysis | null>(null);

  useEffect(() => {
    const availableAgents = fetchAgentService.getAgents();
    setAgents(availableAgents);
    if (availableAgents.length > 0) {
      setSelectedAgent(availableAgents[0].id);
      setMessageHistory(fetchAgentService.getMessageHistory(availableAgents[0].id));
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedAgent) return;

    setIsLoading(true);
    try {
      const response = await fetchAgentService.sendMessage(selectedAgent, message);
      setMessageHistory(fetchAgentService.getMessageHistory(selectedAgent));
      setMessage('');
      
      // Try to parse as analysis result
      try {
        const parsed = JSON.parse(response.content);
        if (parsed.analysis) {
          setAnalysisResult(parsed);
        }
      } catch {
        // Not a structured response
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setMessageHistory(fetchAgentService.getMessageHistory(agentId));
    setAnalysisResult(null);
  };

  const handlePatientAnalysis = async () => {
    setIsLoading(true);
    try {
      const mockPatientData = {
        id: 'patient_001',
        name: 'John Doe',
        age: 45,
        conditions: ['diabetes', 'hypertension'],
        location: 'New York',
        preferences: ['non-invasive', 'compensated']
      };

      const analysis = await fetchAgentService.analyzePatient(mockPatientData);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error in patient analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrialAnalysis = async () => {
    setIsLoading(true);
    try {
      const mockTrialData = {
        id: 'trial_001',
        title: 'Novel Diabetes Treatment Study',
        conditions: ['diabetes'],
        location: 'Multiple sites',
        requirements: ['age_18_65', 'diagnosed_diabetes'],
        compensation: '$500'
      };

      const analysis = await fetchAgentService.analyzeTrial(mockTrialData);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error in trial analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Fetch.ai Agent Showcase</h1>
        </div>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Experience the power of AI agents implementing the Fetch.ai Chat Protocol. 
          These agents work together to analyze patient data, match clinical trials, and provide personalized recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Network className="h-3 w-3 mr-1" />
            Chat Protocol
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Agents
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-orange-500" />
                <span>Available Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handleAgentSelect(agent.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{agent.name}</h3>
                      <p className="text-xs text-gray-600">{agent.address}</p>
                    </div>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agent.capabilities.map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handlePatientAnalysis}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Brain className="h-4 w-4 mr-2" />
                Analyze Patient
              </Button>
              <Button
                onClick={handleTrialAnalysis}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                Analyze Trial
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span>Chat with Agent</span>
                {selectedAgent && (
                  <Badge variant="secondary" className="ml-2">
                    {agents.find(a => a.id === selectedAgent)?.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Message History */}
              <div className="h-64 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
                {messageHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messageHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.from === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {msg.from === 'user' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3 text-orange-500" />
                            )}
                            <span className="text-xs font-medium">
                              {msg.from === 'user' ? 'You' : agents.find(a => a.id === msg.from)?.name}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {msg.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message to the agent..."
                  className="flex-1"
                  rows={2}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="px-6"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Agent Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <span>Agent Capabilities & Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800">AI Analysis</h3>
              <p className="text-sm text-orange-700">Advanced machine learning for patient and trial analysis</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">ICP Integration</h3>
              <p className="text-sm text-blue-700">Secure blockchain storage and smart contract execution</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Privacy First</h3>
              <p className="text-sm text-green-700">End-to-end encryption and zero-knowledge proofs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

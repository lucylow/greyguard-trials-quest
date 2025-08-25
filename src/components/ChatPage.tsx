import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Brain,
  Sparkles,
  Mic,
  MicOff,
  Loader2,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  Zap,
  Shield,
  Lock,
  Globe,
  Network,
  CheckCircle
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI-powered clinical trial assistant. I can help you find relevant trials, answer questions about medical conditions, and guide you through the application process. How can I help you today?",
      timestamp: new Date(),
      isAI: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [chatMode, setChatMode] = useState('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const agents = [
    { id: 'general', name: 'General Assistant', description: 'General clinical trial help', icon: Bot },
    { id: 'patient', name: 'Patient Agent', description: 'Specialized in patient guidance', icon: User },
    { id: 'trial', name: 'Trial Agent', description: 'Expert in trial matching', icon: Search },
    { id: 'medical', name: 'Medical Agent', description: 'Medical condition analysis', icon: Brain }
  ];

  const chatModes = [
    { id: 'text', name: 'Text Chat', icon: MessageSquare },
    { id: 'voice', name: 'Voice Chat', icon: Mic },
    { id: 'ai', name: 'AI Analysis', icon: Sparkles }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      isAI: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        isAI: true
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('diabetes') || input.includes('blood sugar')) {
      return "I found several diabetes clinical trials that might be relevant for you. There's a Phase II study for a new oral medication in New York (95% match), and a Phase III trial for improved insulin therapy in Los Angeles (87% match). Would you like me to show you the details of these trials?";
    }
    
    if (input.includes('cancer') || input.includes('tumor')) {
      return "I've identified some promising cancer immunotherapy trials. There's a breakthrough Phase I study in Houston for advanced solid tumors (92% match) with $1,200 compensation. This trial uses novel checkpoint inhibitors. Should I provide more details about eligibility criteria?";
    }
    
    if (input.includes('heart') || input.includes('cardiac')) {
      return "I found several cardiovascular trials that could be a good fit. There's a heart failure treatment study in Cleveland (86% match) and a hypertension management trial in LA (87% match). Both are currently recruiting. Would you like to learn more about either of these?";
    }
    
    if (input.includes('depression') || input.includes('mental health')) {
      return "I've located some depression treatment studies. There's a Phase III trial in Boston investigating a new antidepressant with faster onset (78% match, $800 compensation). The study is 20 weeks long and currently recruiting. Would you like me to check your eligibility?";
    }
    
    if (input.includes('trial') || input.includes('study')) {
      return "I can help you find clinical trials! I have access to over 12 active trials across various medical conditions. To get the best matches, could you tell me about your specific condition, location preferences, and any other requirements you have?";
    }
    
    if (input.includes('apply') || input.includes('enroll')) {
      return "Great! To help you apply for clinical trials, I'll need to gather some information. I can guide you through the process step by step, or if you prefer, I can connect you directly with a study coordinator. What would work best for you?";
    }
    
    return "Thank you for your message! I'm here to help you find the right clinical trials. I can assist with trial matching, explain medical conditions, help with applications, or answer any questions about the research process. What would you like to know more about?";
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice Recording Started",
        description: "Speak clearly into your microphone. Click the button again to stop recording.",
      });
    } else {
      toast({
        title: "Voice Recording Stopped",
        description: "Processing your voice input...",
      });
      // Simulate voice processing
      setTimeout(() => {
        setInputMessage("I'm interested in diabetes clinical trials near New York");
        toast({
          title: "Voice Input Processed",
          description: "Your message has been transcribed and is ready to send.",
        });
      }, 2000);
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload feature coming soon! You'll be able to share medical documents for better trial matching.",
    });
  };

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    toast({
      title: "Agent Changed",
      description: `Switched to ${agents.find(a => a.id === agentId)?.name}`,
    });
  };

  const handleChatModeChange = (modeId: string) => {
    setChatMode(modeId);
    toast({
      title: "Chat Mode Changed",
      description: `Switched to ${chatModes.find(m => m.id === modeId)?.name}`,
    });
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'assistant',
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date(),
      isAI: true
    }]);
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">AI Chat Assistant</h1>
            <p className="text-xl text-slate-600">Your intelligent clinical trial companion</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Privacy Protected
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Network className="h-3 w-3 mr-1" />
            ICP Connected
          </Badge>
        </div>
      </div>

      {/* Agent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span>Choose Your AI Agent</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <Button
                  key={agent.id}
                  variant={selectedAgent === agent.id ? 'default' : 'outline'}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedAgent === agent.id 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => handleAgentChange(agent.id)}
                >
                  <IconComponent className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs opacity-80">{agent.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span>Chat with {agents.find(a => a.id === selectedAgent)?.name}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
              <Button variant="outline" size="sm" onClick={handleFileUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chat Mode Selection */}
          <div className="flex items-center space-x-2 mb-4">
            {chatModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={chatMode === mode.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleChatModeChange(mode.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{mode.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-slate-50 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.isAI ? (
                      <Bot className="h-4 w-4 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-slate-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant={isRecording ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleVoiceToggle}
              disabled={chatMode !== 'voice'}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <span>AI Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Our AI agents use advanced machine learning to understand your needs and provide personalized assistance.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Natural language processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Context-aware responses</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Medical knowledge base</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Your conversations are encrypted and protected with enterprise-grade security measures.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3 text-green-500" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3 text-green-500" />
                <span>HIPAA compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3 text-green-500" />
                <span>Zero-knowledge storage</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span>Multi-Modal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Support for text, voice, and AI-powered analysis modes for flexible interaction.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3 text-purple-500" />
                <span>Text chat interface</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="h-3 w-3 text-purple-500" />
                <span>Voice recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-3 w-3 text-purple-500" />
                <span>AI analysis mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

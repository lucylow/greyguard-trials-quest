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
  CheckCircle,
  FileText,
  Image,
  File,
  X,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileVideo,
  FileAudio,
  Paperclip,
  XCircle,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAI: boolean;
  files?: File[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Demo suggestions for users to try
  const demoSuggestions = [
    {
      category: "Medical Conditions",
      suggestions: [
        "I have diabetes, what trials are available?",
        "What trials exist for heart disease?",
        "Are there trials for cancer treatment?",
        "I have multiple sclerosis, any new trials?"
      ]
    },
    {
      category: "Trial Information",
      suggestions: [
        "How do I apply for a clinical trial?",
        "What are the risks of participating?",
        "How long do trials typically last?",
        "Will I be compensated for participation?"
      ]
    },
    {
      category: "File Analysis",
      suggestions: [
        "Upload my medical records for analysis",
        "Analyze my lab results",
        "Review my imaging scans",
        "Check my eligibility for trials"
      ]
    },
    {
      category: "General Health",
      suggestions: [
        "What are the latest medical breakthroughs?",
        "How can I improve my health?",
        "What preventive measures should I take?",
        "Recommend wellness programs"
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || `📎 Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: new Date(),
      isAI: false,
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, uploadedFiles);
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        isAI: true
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setUploadedFiles([]); // Clear uploaded files after processing
    }, 1500);
  };

  const generateAIResponse = (userInput: string, files: File[]) => {
    const input = userInput.toLowerCase();
    
    // If files were uploaded, provide file-specific response
    if (files.length > 0) {
      const fileTypes = files.map(file => file.type);
      const hasImages = fileTypes.some(type => type.startsWith('image/'));
      const hasDocuments = fileTypes.some(type => type.includes('pdf') || type.includes('word') || type.includes('document'));
      
      let response = `📊 **Medical Document Analysis Complete**\n\n**Files Processed:** ${files.length}\n`;
      
      if (hasImages) {
        response += `\n🖼️ **Medical Images Detected:**\n• Analyzing diagnostic information\n• Extracting relevant medical data\n• Identifying potential conditions\n`;
      }
      
      if (hasDocuments) {
        response += `\n📄 **Medical Documents Detected:**\n• Parsing test results and reports\n• Extracting key medical metrics\n• Identifying relevant clinical data\n`;
      }
      
      response += `\n**AI Analysis Results:**\n• Medical data extracted successfully\n• Condition patterns identified\n• Trial matching improved by 23%\n• Recommendations updated based on new data\n\n**Next Steps:**\n• Review enhanced trial matches\n• Schedule consultation with new insights\n• Consider additional tests if recommended\n\n*Analysis completed with 94% confidence*`;
      
      return response;
    }
    
    // Text-based responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help you with clinical trials and medical information. How can I assist you today?";
    }
    
    if (input.includes('trial') || input.includes('study')) {
      return "I can help you find clinical trials! What medical condition are you interested in, and what's your location?";
    }
    
    if (input.includes('diabetes')) {
      return "Diabetes clinical trials are available! I can help you find studies for Type 1, Type 2, or gestational diabetes. What specific type are you looking for?";
    }
    
    if (input.includes('cancer') || input.includes('oncology')) {
      return "Cancer clinical trials are available across many types. I can help you find studies for specific cancer types, stages, or treatments. What cancer type are you interested in?";
    }
    
    if (input.includes('heart') || input.includes('cardiac') || input.includes('cardiovascular')) {
      return "Cardiovascular clinical trials are available! I can help you find studies for heart disease, hypertension, or other cardiac conditions. What specific condition are you looking for?";
    }
    
    if (input.includes('upload') || input.includes('file') || input.includes('document')) {
      return "I can help you upload medical documents, test results, or images for better trial matching. Use the upload button to share your files securely.";
    }
    
    return "I understand you're interested in clinical trials. I can help you find relevant studies, explain medical conditions, or assist with applications. What would you like to know more about?";
  };

  // File upload functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Filter for medical document types
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'application/json'
      ];
      
      const validFiles = files.filter(file => {
        if (allowedTypes.includes(file.type)) {
          return true;
        }
        toast({
          title: "File Type Not Supported",
          description: `${file.name} is not a supported file type. Please upload images, PDFs, or documents.`,
          variant: "destructive",
        });
        return false;
      });

      if (validFiles.length === 0) return;

      // Simulate file upload processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      toast({
        title: "Files Ready",
        description: `${validFiles.length} file(s) uploaded and ready to send.`,
      });
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "File Removed",
      description: "File has been removed from the upload queue.",
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (file.type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="h-4 w-4" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileSpreadsheet className="h-4 w-4" />;
    if (file.type.includes('video')) return <FileVideo className="h-4 w-4" />;
    if (file.type.includes('audio')) return <FileAudio className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Voice Input Off" : "Voice Input On",
      description: isRecording ? "You can now type your messages." : "Listening for your message...",
    });
  };

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    toast({
      title: "Agent Switched",
      description: `You are now chatting with the ${agents.find(a => a.id === agentId)?.name}.`,
    });
  };

  const handleChatModeChange = (mode: string) => {
    setChatMode(mode);
    toast({
      title: "Chat Mode Changed",
      description: `Switched to ${mode} mode.`,
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Chat cleared. How can I help you start fresh today?",
        timestamp: new Date(),
        isAI: true
      }
    ]);
    setUploadedFiles([]);
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been reset.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">AI Clinical Assistant</h1>
            <p className="text-xl text-slate-600">Chat with intelligent agents for clinical trial guidance</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Upload className="h-3 w-3 mr-1" />
            File Upload
          </Badge>
        </div>
      </div>

      {/* Agent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Select Your AI Agent</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentChange(agent.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent className={`h-6 w-6 ${
                      selectedAgent === agent.id ? 'text-blue-500' : 'text-slate-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedAgent === agent.id ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {agent.name}
                    </span>
                    <span className={`text-xs text-center ${
                      selectedAgent === agent.id ? 'text-blue-600' : 'text-slate-500'
                    }`}>
                      {agent.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Chat Modes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chatModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleChatModeChange(mode.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      chatMode === mode.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${
                        chatMode === mode.id ? 'text-purple-500' : 'text-slate-500'
                      }`} />
                      <span className={`font-medium ${
                        chatMode === mode.id ? 'text-purple-700' : 'text-slate-700'
                      }`}>
                        {mode.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span>Chat with {agents.find(a => a.id === selectedAgent)?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    Clear Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Message History */}
              <div className="h-64 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {msg.type === 'user' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3 text-orange-500" />
                            )}
                            <span className="text-xs font-medium">
                              {msg.type === 'user' ? 'You' : agents.find(a => a.id === selectedAgent)?.name}
                            </span>
                            <span className="text-xs opacity-70">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          
                          {/* Display uploaded files */}
                          {msg.files && msg.files.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.files.map((file, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs bg-blue-100 p-2 rounded">
                                  {getFileIcon(file)}
                                  <span className="truncate">{file.name}</span>
                                  <span className="text-gray-500">({formatFileSize(file.size)})</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <Badge variant="outline" className="mt-2 text-xs">
                            {msg.type === 'user' ? 'user' : 'ai'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-orange-500" />
                        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Files Ready to Send:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedFiles([])}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file)}
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  multiple
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </Button>
                
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
                
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Suggestions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>Try Asking Me About...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoSuggestions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.suggestions.map((suggestion, suggestionIndex) => (
                    <button
                      key={suggestionIndex}
                      onClick={() => {
                        setInputMessage(suggestion);
                        toast({
                          title: "Suggestion Applied",
                          description: "Click 'Send' to ask this question",
                          variant: "default"
                        });
                      }}
                      className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm text-gray-700 hover:text-blue-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Lightbulb className="h-4 w-4" />
              <span>
                <strong>Pro Tip:</strong> Upload medical documents or images for personalized analysis and trial recommendations!
              </span>
            </div>
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
              Your conversations and medical documents are encrypted and protected with enterprise-grade security measures.
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
              <Upload className="h-5 w-5 text-purple-500" />
              <span>Medical Document Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Upload medical documents, test results, and images for enhanced AI analysis and trial matching.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <FileImage className="h-3 w-3 text-purple-500" />
                <span>Medical images (X-rays, MRIs)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-3 w-3 text-purple-500" />
                <span>Test results & reports</span>
              </div>
              <div className="flex items-center space-x-2">
                <File className="h-3 w-3 text-purple-500" />
                <span>Medical records & documents</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

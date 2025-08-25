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
    { id: 'ai', name: 'AI Analysis', icon: Sparkles },
    { id: 'image', name: 'Image Analysis', icon: Eye }
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Chat Interface</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Mode Selection */}
          <div className="flex flex-wrap gap-2">
            {chatModes.map((mode) => (
              <Button
                key={mode.id}
                variant={chatMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setChatMode(mode.id)}
                className="flex items-center space-x-2"
              >
                <mode.icon className="h-4 w-4" />
                <span>{mode.name}</span>
              </Button>
            ))}
          </div>

          {/* Image Analysis Mode */}
          {chatMode === 'image' && (
            <div className="space-y-4">
              <div className="text-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Image Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Upload medical images for AI-powered analysis and diagnosis assistance
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 mb-2">Supported Formats:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• X-Ray images (PNG, JPG)</li>
                      <li>• MRI scans (PNG, JPG)</li>
                      <li>• CT scans (PNG, JPG)</li>
                      <li>• Ultrasound images (PNG, JPG)</li>
                      <li>• Pathology slides (PNG, JPG)</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 mb-2">Analysis Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Automated abnormality detection</li>
                      <li>• Medical condition classification</li>
                      <li>• Confidence scoring</li>
                      <li>• Clinical recommendations</li>
                      <li>• Trial matching suggestions</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Medical Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setChatMode('text')}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Switch to Text Chat
                  </Button>
                </div>
              </div>

              {/* Image Analysis Results */}
              {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Image Analysis Results</h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileImage className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {file.type.includes('image/') ? 'Medical Image' : 'Document'} • {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                      <Brain className="h-4 w-4" />
                      <span>
                        <strong>AI Analysis Ready:</strong> Click "Send" to analyze your medical images and get personalized insights
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Regular Chat Interface for other modes */}
          {chatMode !== 'image' && (
            <>
              {/* Messages Display */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Display uploaded files in messages */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs opacity-75 mb-2">Attached files:</p>
                          <div className="space-y-2">
                            {message.files.map((file, fileIndex) => (
                              <div key={fileIndex} className="flex items-center space-x-2 text-xs">
                                {getFileIcon(file.type)}
                                <span className="truncate">{file.name}</span>
                                <span className="text-gray-500">({formatFileSize(file.size)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder={
                      chatMode === 'voice' 
                        ? "Click microphone to start recording..." 
                        : "Type your message..."
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={chatMode === 'voice'}
                  />
                </div>
                
                {chatMode === 'voice' ? (
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    variant={isRecording ? "destructive" : "default"}
                    className="px-4"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                ) : (
                  <Button onClick={handleSendMessage} disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}>
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* File Upload for non-image modes */}
              {chatMode !== 'image' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-600"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                  <span className="text-xs text-gray-500">
                    Support for documents, images, and medical records
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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

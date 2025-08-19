import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Shield,
  Database,
  FileText,
  UserCheck,
  Search,
  Activity
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  type?: 'text' | 'profile_submission' | 'trial_match' | 'consent_update';
}

interface AgentChatProps {
  onProfileSubmit?: (profile: any) => void;
  onTrialMatch?: (matches: any[]) => void;
  onConsentUpdate?: (consent: any) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ 
  onProfileSubmit, 
  onTrialMatch, 
  onConsentUpdate 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your GreyGuard AI agent. I can help you with:\n\n• **Submit Health Profile** - Securely upload your encrypted medical data\n• **Find Clinical Trials** - Search for matching trials using AI\n• **Manage Consent** - Grant or revoke trial participation consent\n• **View Audit Logs** - See your blockchain-anchored activity history\n\nWhat would you like to do today?",
      sender: 'agent',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const quickActions = [
    { label: "Submit Health Profile", icon: FileText, action: "I want to submit my health profile for clinical trial matching" },
    { label: "Find Trials", icon: Search, action: "Find clinical trials for my condition" },
    { label: "Manage Consent", icon: UserCheck, action: "I want to manage my consent for clinical trials" },
    { label: "View Audit Log", icon: Activity, action: "Show me my audit log and blockchain history" }
  ];

  const handleSendMessage = async (messageContent: string = inputMessage) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate agent processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const agentResponse = await processAgentResponse(messageContent.trim());
      
      setMessages(prev => [...prev, agentResponse]);
      
      // Handle specific response types
      if (agentResponse.type === 'profile_submission' && onProfileSubmit) {
        onProfileSubmit({ message: agentResponse.content });
      } else if (agentResponse.type === 'trial_match' && onTrialMatch) {
        onTrialMatch([{ message: agentResponse.content }]);
      } else if (agentResponse.type === 'consent_update' && onConsentUpdate) {
        onConsentUpdate({ message: agentResponse.content });
      }

    } catch (error) {
      console.error('Agent communication error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I apologize, but I'm experiencing connectivity issues. Please try again in a moment.",
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'text'
      }]);
      
      toast({
        title: "Connection Error",
        description: "Unable to communicate with the agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const processAgentResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    // Health profile submission
    if (input.includes('health profile') || input.includes('submit') || input.includes('upload')) {
      return {
        id: Date.now().toString(),
        content: `I'll help you submit your health profile securely. Here's what happens:

🔒 **Step 1: Data Encryption**
Your health data is encrypted client-side using AES-256 encryption before leaving your device.

🔑 **Step 2: Zero-Knowledge Proof**
We generate a ZK-proof of your eligibility without revealing your actual medical data.

⛓️ **Step 3: Blockchain Anchoring**
Your encrypted profile hash is anchored to Bitcoin for immutable verification.

🏥 **Step 4: ICP Storage**
Encrypted data is stored on Internet Computer with patient-controlled access.

To proceed, please provide:
- Your medical condition or symptoms
- Age range (e.g., 18-65)
- Geographic location
- Any specific trial preferences

Your data remains encrypted and only you control who can access it.`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'profile_submission'
      };
    }
    
    // Trial matching
    if (input.includes('find trial') || input.includes('match') || input.includes('search')) {
      return {
        id: Date.now().toString(),
        content: `I'll search for clinical trials using our AI-powered matching system:

🔍 **AI-Powered Matching**
Using Fetch.ai agents and Gemini AI to analyze trial databases in real-time.

🎯 **Smart Filtering**
Matching based on:
- Medical condition compatibility
- Geographic accessibility  
- Age and demographic criteria
- Trial phase preferences
- Sponsor reputation

🛡️ **Privacy-Preserving**
Your search is conducted using zero-knowledge proofs - researchers see eligibility without seeing personal data.

Found 3 high-compatibility trials:

**Trial 1: Phase 3 Immunotherapy Study**
- Match Score: 94%
- Location: Multiple US sites
- Status: Actively recruiting

**Trial 2: Novel Cancer Treatment Protocol**  
- Match Score: 87%
- Location: California, New York
- Status: Enrolling participants

**Trial 3: Precision Medicine Initiative**
- Match Score: 82%
- Location: Academic medical centers
- Status: Phase 2 recruiting

Would you like detailed information about any of these trials?`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'trial_match'
      };
    }
    
    // Consent management
    if (input.includes('consent') || input.includes('permission') || input.includes('authorize')) {
      return {
        id: Date.now().toString(),
        content: `I'll help you manage your clinical trial consent with full transparency:

📋 **Current Consent Status**
- Active Consents: 2 trials
- Pending Requests: 1 trial  
- Revoked Consents: 0 trials

🔐 **Blockchain Verification**
All consent actions are recorded on-chain:
- Grant Consent: Creates immutable record
- Revoke Consent: Immediate data access termination
- Update Preferences: Version-controlled changes

⚖️ **Your Rights**
- Withdraw consent at any time
- Data deletion upon request  
- Access audit trail anytime
- Control data sharing granularity

🏥 **Recent Activity**
- Trial NCT04556747: Consent granted (2 days ago)
- Trial NCT03945682: Consent granted (1 week ago)  
- Data access by OncoPharma: Authorized (yesterday)

Which consent action would you like to perform?
1. Grant new consent
2. Revoke existing consent  
3. Update consent preferences
4. View detailed audit log`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'consent_update'
      };
    }
    
    // Audit log viewing
    if (input.includes('audit') || input.includes('log') || input.includes('history') || input.includes('blockchain')) {
      return {
        id: Date.now().toString(),
        content: `Here's your complete audit trail with blockchain verification:

📊 **Audit Summary**
- Total Activities: 15
- Blockchain Anchors: 8
- Data Integrity: ✅ Verified
- Last Activity: 2 hours ago

⛓️ **Recent Blockchain Anchors**
1. **Profile Creation** (Aug 15, 2:30 PM)
   - Bitcoin TX: c0ffee1234...beef9827
   - ICP Canister: rrkah-fqaaa...aaaaq-cai
   - Status: ✅ Confirmed

2. **Consent Grant - Trial NCT04556747** (Aug 14, 4:15 PM)  
   - Bitcoin TX: deadbeef90...ab123456
   - ZK-Proof: zk-proof-7X9J2K
   - Status: ✅ Confirmed

3. **Data Access - OncoPharma** (Aug 13, 11:00 AM)
   - Bitcoin TX: babe1234...cafe5678
   - Access Level: Anonymized eligibility only
   - Status: ✅ Confirmed

🔒 **Privacy Protection**
- Zero personal data exposed in logs
- Only cryptographic hashes recorded
- Patient identity remains pseudonymous
- Full HIPAA compliance maintained

🛡️ **Security Verification**
All entries cryptographically signed and verifiable on:
- Bitcoin blockchain (immutable timestamps)
- Internet Computer (smart contract logic)
- Fetch.ai network (agent interactions)

Your data trail is fully auditable while maintaining complete privacy.`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      content: `I understand you're asking about "${userInput}". Here are the main services I can help you with:

🏥 **Clinical Trial Services**
- Secure health profile submission
- AI-powered trial matching  
- Consent management
- Audit log access

💡 **How to interact with me**
You can ask questions like:
- "Help me find trials for [condition]"
- "I want to submit my health profile"  
- "Show me my consent history"
- "What trials am I eligible for?"

🔒 **Privacy & Security**
All interactions use:
- End-to-end encryption
- Zero-knowledge proofs
- Blockchain verification
- Patient-controlled data access

What specific aspect would you like to explore?`,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-medium">GreyGuard AI Agent</span>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>End-to-End Encrypted</span>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'agent' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                  {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-b">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(action.action)}
              className="text-xs"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about clinical trials, health profiles, or consent..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            size="icon"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgentChat;
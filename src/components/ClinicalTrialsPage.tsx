import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Send, 
  Loader2, 
  FileText, 
  MapPin,
  Shield,
  CheckCircle,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface ClinicalTrialsPageProps {
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  location: string;
  setLocation: (location: string) => void;
  matches: any[];
  selectedTrial: any;
  onTrialSelect: (trial: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  chatHistory: any[];
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

export const ClinicalTrialsPage: React.FC<ClinicalTrialsPageProps> = ({
  symptoms,
  setSymptoms,
  location,
  setLocation,
  matches,
  selectedTrial,
  onTrialSelect,
  onSubmit,
  loading,
  chatHistory,
  chatContainerRef
}) => {
  const [activeSubTab, setActiveSubTab] = useState('matching');

  const ChatMessage = ({ message }: { message: any }) => (
    <div className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );

  const TrialResults = ({ matches, onSelect, selectedTrial }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Trial Results
        </CardTitle>
        <CardDescription>
          {matches.length > 0 
            ? `${matches.length} matching trials found` 
            : 'No trials found yet. Describe your symptoms to get started.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start by describing your symptoms to find matching trials</p>
          </div>
        ) : (
          matches.map((trial) => (
            <Card
              key={trial.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTrial?.id === trial.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelect(trial)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-sm line-clamp-2">{trial.title}</h4>
                  <Badge variant={trial.status === 'Recruiting' ? 'default' : 'secondary'}>
                    {trial.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{trial.locations.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{trial.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Match Score: {trial.matchScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );

  const TrialDetails = ({ trial, onConsent }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trial Details</span>
          <Badge variant="outline">{trial.phase}</Badge>
        </CardTitle>
        <CardDescription>{trial.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
            <p className="text-sm text-muted-foreground">{trial.criteria}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Locations</h4>
            <div className="space-y-1">
              {trial.locations.map((loc: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{trial.matchScore}%</div>
            <div className="text-sm text-muted-foreground">Match Score</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{trial.participants}</div>
            <div className="text-sm text-muted-foreground">Participants</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{trial.phase}</div>
            <div className="text-sm text-muted-foreground">Phase</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Contact Information</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="text-sm">{trial.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trial ID:</span>
            <span className="text-sm font-mono">{trial.id}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => onConsent(trial)} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            Give Consent
          </Button>
          <Button variant="outline" asChild>
            <a href={trial.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on ClinicalTrials.gov
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Clinical Trials</h1>
        <p className="text-muted-foreground">
          Find the right clinical trials for your condition with AI-powered matching
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matching">Trial Matching</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedTrial}>
            Trial Details
          </TabsTrigger>
        </TabsList>

        {/* Trial Matching Tab */}
        <TabsContent value="matching" className="space-y-6">
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
                  <form onSubmit={onSubmit} className="space-y-3">
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
                onSelect={onTrialSelect} 
                selectedTrial={selectedTrial}
              />
            </div>
          </div>
        </TabsContent>

        {/* Trial Details Tab */}
        <TabsContent value="details">
          {selectedTrial ? (
            <TrialDetails trial={selectedTrial} onConsent={() => {}} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a trial to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Privacy Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Your Information is Secure and Private</h4>
              <p className="text-sm text-green-700">
                All data is encrypted, HIPAA compliant, and protected with zero-knowledge proofs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

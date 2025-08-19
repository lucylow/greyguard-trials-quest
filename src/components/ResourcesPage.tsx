import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Image, 
  Brain, 
  Users, 
  Trophy, 
  BookOpen,
  Download,
  ExternalLink,
  Sparkles,
  Code,
  Globe,
  Shield,
  Activity
} from 'lucide-react';
import ImageAgents from './ImageAgents';
import { VoiceDemo } from './VoiceDemo';

export const ResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('image-ai');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Additional tools, information, and resources for the GreyGuard Trials platform
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-ai">Image AI</TabsTrigger>
          <TabsTrigger value="about">About & Hackathon</TabsTrigger>
        </TabsList>

        {/* Image AI Tab */}
        <TabsContent value="image-ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    AI Image Generation
                  </CardTitle>
                  <CardDescription>
                    Create and analyze medical images using cutting-edge AI technology
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">DALL-E 3 Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Privacy-First Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Real-Time Processing</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎨 Image AI Features:</h4>
                    <ul className="text-sm space-y-1 text-blue-700">
                      <li>• Generate medical illustrations from text descriptions</li>
                      <li>• Analyze medical images for content and objects</li>
                      <li>• Create educational materials for clinical trials</li>
                      <li>• Visualize complex medical concepts</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ImageAgents />
            </div>
          </div>
        </TabsContent>

        {/* About & Hackathon Tab */}
        <TabsContent value="about" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    GreyGuard Trials is a revolutionary platform that combines AI, blockchain technology, 
                    and privacy-preserving cryptography to transform clinical trial discovery.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">2024</div>
                      <div className="text-sm text-muted-foreground">Founded</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="text-sm text-muted-foreground">Privacy-First</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hackathon Information */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Trophy className="h-5 w-5" />
                    Hackathon Project
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-yellow-700">
                    This project was developed as part of a hackathon focused on decentralized 
                    healthcare solutions and AI integration.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-800">🏆 Hackathon Goals:</h4>
                    <ul className="text-sm space-y-1 text-yellow-700">
                      <li>• Demonstrate cutting-edge AI and blockchain integration</li>
                      <li>• Showcase privacy-preserving medical technology</li>
                      <li>• Create a scalable clinical trial matching platform</li>
                      <li>• Highlight the potential of decentralized healthcare</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Technology Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Badge variant="outline" className="justify-center">React + TypeScript</Badge>
                    <Badge variant="outline" className="justify-center">Fetch.ai Agents</Badge>
                    <Badge variant="outline" className="justify-center">Internet Computer</Badge>
                    <Badge variant="outline" className="justify-center">Zero-Knowledge Proofs</Badge>
                    <Badge variant="outline" className="justify-center">Supabase</Badge>
                    <Badge variant="outline" className="justify-center">Tailwind CSS</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Voice AI Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Voice AI Demo
                  </CardTitle>
                  <CardDescription>
                    Experience our cutting-edge voice interface with speech-to-text and text-to-speech
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VoiceDemo />
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#documentation">
                      <Download className="mr-2 h-4 w-4" />
                      Download Documentation
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#github">
                      <Code className="mr-2 h-4 w-4" />
                      View Source Code
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#demo">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Contact & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      For questions, support, or collaboration opportunities:
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Email: contact@greyguard-trials.com</p>
                      <p className="text-muted-foreground">GitHub: github.com/greyguard-trials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resources Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sparkles className="h-5 w-5" />
            Platform Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Image className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">AI Tools</h4>
              <p className="text-sm text-green-700">
                Image generation, analysis, and voice interfaces
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Documentation</h4>
              <p className="text-sm text-blue-700">
                Comprehensive guides and API references
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Community</h4>
              <p className="text-sm text-purple-700">
                Developer support and collaboration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Brain, 
  Activity, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Users,
  Globe
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            No more grey areas in clinical matching
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Decentralized Clinical Trial Matching powered by AI and blockchain technology
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6">
              <Target className="mr-2 h-5 w-5" />
              Find Clinical Trials
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Brain className="mr-2 h-5 w-5" />
              Learn About AI Agents
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Data Encrypted</h3>
          <p className="text-muted-foreground">
            Your personal health information is protected with end-to-end encryption
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">HIPAA Compliant</h3>
          <p className="text-muted-foreground">
            We meet all healthcare privacy and security standards
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Zero-Knowledge Proofs</h3>
          <p className="text-muted-foreground">
            Advanced cryptography ensures your data remains private during matching
          </p>
        </Card>
      </div>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-blue-600" />
            <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
            <p className="text-xl text-blue-800 max-w-4xl mx-auto">
              To revolutionize clinical trial discovery by bringing transparency, privacy, and efficiency 
              to the process. We eliminate the grey areas that prevent patients from finding the right 
              trials while ensuring their data remains completely secure and private.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Powered Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI agents analyze your symptoms and medical history to find the most suitable clinical trials
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy-First Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Zero-knowledge proofs and encryption ensure your data never leaves your control
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Decentralized Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built on blockchain technology for transparency, security, and global accessibility
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Patient-Centric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Designed with patients in mind, making trial discovery simple and accessible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Real-Time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get instant notifications about new trials and updates to existing ones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Precision Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced algorithms ensure you only see trials that are truly relevant to your condition
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground text-center">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Clinical Trial?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of patients who have already discovered the right trials for their conditions
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

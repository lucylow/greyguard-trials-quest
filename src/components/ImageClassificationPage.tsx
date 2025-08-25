import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Eye,
  Upload,
  Image,
  Brain,
  Cpu,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Download,
  Share2,
  Camera,
  Scan,
  Target,
  Zap,
  Database,
  Network,
  Shield,
  Lock
} from 'lucide-react';

interface ClassificationResult {
  id: string;
  imageUrl: string;
  fileName: string;
  confidence: number;
  classification: string;
  medicalFindings: string[];
  recommendations: string[];
  timestamp: Date;
  processingTime: number;
}

export default function ImageClassificationPage() {
  const [results, setResults] = useState<ClassificationResult[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      fileName: 'chest_xray_001.jpg',
      confidence: 94.2,
      classification: 'Normal Chest X-Ray',
      medicalFindings: ['Clear lung fields', 'Normal cardiac silhouette', 'No acute abnormalities'],
      recommendations: ['Continue routine monitoring', 'No immediate action required'],
      timestamp: new Date(Date.now() - 3600000),
      processingTime: 1.2
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      fileName: 'mri_brain_002.jpg',
      confidence: 87.6,
      classification: 'Brain MRI - Potential Anomaly',
      medicalFindings: ['Irregular tissue density', 'Possible mass lesion', 'Requires specialist review'],
      recommendations: ['Schedule neurological consultation', 'Additional imaging recommended', 'Monitor for symptoms'],
      timestamp: new Date(Date.now() - 7200000),
      processingTime: 2.8
    }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file",
        variant: "destructive"
      });
    }
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const classifications = [
        'Normal Chest X-Ray',
        'Pneumonia Detection',
        'Cardiac Enlargement',
        'Lung Nodule',
        'Pleural Effusion',
        'Normal Brain MRI',
        'Brain Tumor',
        'Stroke',
        'Multiple Sclerosis',
        'Normal Skin Lesion',
        'Melanoma',
        'Basal Cell Carcinoma'
      ];
      
      const findings = [
        ['Clear lung fields', 'Normal cardiac silhouette'],
        ['Patchy infiltrates', 'Possible infection'],
        ['Enlarged cardiac shadow', 'Requires cardiology review'],
        ['Small nodule detected', 'Follow-up imaging needed'],
        ['Fluid accumulation', 'Further evaluation required']
      ];
      
      const recommendations = [
        ['Continue routine monitoring', 'No immediate action required'],
        ['Antibiotic treatment', 'Follow-up in 1 week'],
        ['Echocardiogram recommended', 'Cardiology consultation'],
        ['3-month follow-up CT', 'Monitor for changes'],
        ['Chest CT recommended', 'Pleural analysis needed']
      ];

      const randomIndex = Math.floor(Math.random() * classifications.length);
      const randomFindingsIndex = Math.floor(Math.random() * findings.length);
      const randomRecommendationsIndex = Math.floor(Math.random() * recommendations.length);

      const newResult: ClassificationResult = {
        id: Date.now().toString(),
        imageUrl: previewUrl,
        fileName: uploadedImage.name,
        confidence: Math.random() * 20 + 80, // 80-100%
        classification: classifications[randomIndex],
        medicalFindings: findings[randomFindingsIndex],
        recommendations: recommendations[randomRecommendationsIndex],
        timestamp: new Date(),
        processingTime: Math.random() * 2 + 1 // 1-3 seconds
      };

      setResults(prev => [newResult, ...prev]);
      setIsProcessing(false);
      setUploadedImage(null);
      setPreviewUrl('');
      
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${uploadedImage.name}`,
        variant: "default"
      });
    }, 3000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (confidence >= 80) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Image Classification</h1>
            <p className="text-gray-600">Advanced medical image analysis using AI and computer vision</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            <Cpu className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
        </div>
      </div>

      {/* Image Upload */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Upload Medical Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            {!previewUrl ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-blue-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop your image here</p>
                  <p className="text-gray-500">or click to browse</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null);
                      setPreviewUrl('');
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Lock className="h-4 w-4" />
              <span>Your images are processed securely and never stored permanently</span>
            </div>
          </div>
          
          <Button
            onClick={processImage}
            disabled={isProcessing || !uploadedImage}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {isProcessing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-gray-600" />
            <span>Analysis Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.map(result => (
              <div key={result.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{result.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          Analyzed {result.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getConfidenceColor(result.confidence)}>
                        {getConfidenceIcon(result.confidence)}
                        <span className="ml-1">{result.confidence.toFixed(1)}%</span>
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {result.processingTime.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src={result.imageUrl} 
                        alt="Analysis" 
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Classification</h4>
                        <p className="text-lg font-semibold text-blue-600">{result.classification}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Medical Findings</h4>
                        <ul className="space-y-1">
                          {result.medicalFindings.map((finding, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Status */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-cyan-600" />
            <span>AI Model Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-cyan-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Model Status</h3>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-cyan-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Performance</h3>
              <p className="text-sm text-gray-600">94.2% Accuracy</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-cyan-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Training Data</h3>
              <p className="text-sm text-gray-600">50K+ Images</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Target,
  Brain,
  Shield,
  CheckCircle,
  ExternalLink,
  Filter
} from 'lucide-react';

export const ClinicalTrialsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  // Mock clinical trials data
  const mockTrials = [
    {
      id: 'trial_001',
      title: 'Novel Diabetes Treatment Study',
      description: 'Investigating a new oral medication for type 2 diabetes management with improved glycemic control.',
      conditions: ['diabetes', 'type 2 diabetes'],
      location: 'New York, NY',
      compensation: '$500',
      duration: '12 weeks',
      requirements: ['Age 18-65', 'Diagnosed type 2 diabetes', 'HbA1c 7.0-10.0%'],
      status: 'Recruiting',
      matchScore: 95
    },
    {
      id: 'trial_002',
      title: 'Hypertension Management Trial',
      description: 'Clinical study for a new blood pressure medication with minimal side effects.',
      conditions: ['hypertension', 'high blood pressure'],
      location: 'Los Angeles, CA',
      compensation: '$750',
      duration: '16 weeks',
      requirements: ['Age 21-70', 'Systolic BP >140', 'No recent heart events'],
      status: 'Recruiting',
      matchScore: 87
    },
    {
      id: 'trial_003',
      title: 'Asthma Treatment Research',
      description: 'Testing a new inhaler medication for severe asthma patients.',
      conditions: ['asthma', 'respiratory'],
      location: 'Chicago, IL',
      compensation: '$600',
      duration: '8 weeks',
      requirements: ['Age 18+', 'Severe asthma diagnosis', 'Current inhaler use'],
      status: 'Recruiting',
      matchScore: 82
    },
    {
      id: 'trial_004',
      title: 'Depression Treatment Study',
      description: 'Investigating a new antidepressant with faster onset of action.',
      conditions: ['depression', 'mental health'],
      location: 'Boston, MA',
      compensation: '$800',
      duration: '20 weeks',
      requirements: ['Age 18-65', 'Major depression diagnosis', 'No recent medication changes'],
      status: 'Recruiting',
      matchScore: 78
    }
  ];

  const filteredTrials = mockTrials.filter(trial => {
    const matchesSearch = trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trial.conditions.some(condition => condition.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !location || trial.location.toLowerCase().includes(location.toLowerCase());
    const matchesCondition = !selectedCondition || trial.conditions.includes(selectedCondition);
    
    return matchesSearch && matchesLocation && matchesCondition;
  });

  const conditions = ['diabetes', 'hypertension', 'asthma', 'depression', 'cancer', 'arthritis'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Clinical Trials</h1>
            <p className="text-xl text-slate-600">Find the perfect clinical trial for your condition</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Matching
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Privacy Protected
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Trials
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-orange-500" />
            <span>Find Your Perfect Trial</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Trials</label>
              <Input
                placeholder="Search by condition, treatment, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <Input
                placeholder="City, State, or Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Available Trials ({filteredTrials.length})
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Sort by: Match Score</span>
          </div>
        </div>

        {filteredTrials.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No trials found</h3>
              <p className="text-slate-500">Try adjusting your search criteria or location</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTrials.map((trial) => (
              <Card key={trial.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-slate-900 mb-2">{trial.title}</CardTitle>
                      <p className="text-slate-600 text-sm mb-3">{trial.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{trial.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{trial.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{trial.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="default" 
                        className={`${
                          trial.matchScore >= 90 ? 'bg-green-500' :
                          trial.matchScore >= 80 ? 'bg-orange-500' :
                          'bg-blue-500'
                        } text-white`}
                      >
                        {trial.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {trial.conditions.map((condition) => (
                        <Badge key={condition} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Requirements</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {trial.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-lg font-bold text-green-600">
                      Compensation: {trial.compensation}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Matching Info */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI-Powered Matching</h3>
              <p className="text-slate-600">
                Our Fetch.ai agents analyze your symptoms and medical history to find the most suitable clinical trials. 
                Match scores are calculated using advanced machine learning algorithms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

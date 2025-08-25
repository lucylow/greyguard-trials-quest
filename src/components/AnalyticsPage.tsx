import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Activity,
  Target,
  Award,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  RefreshCw,
  Filter,
  Search,
  Eye,
  EyeOff,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  // Mock data for analytics
  const overviewMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalTrials: 156,
    activeTrials: 89,
    totalApplications: 2341,
    successRate: 78.5,
    revenue: 45600,
    growthRate: 23.4
  };

  const userMetrics = {
    newUsers: [45, 52, 48, 61, 55, 67, 58, 72, 65, 78, 82, 89],
    activeUsers: [234, 256, 278, 301, 289, 312, 298, 325, 341, 356, 378, 401],
    userRetention: 84.2,
    topLocations: [
      { location: 'New York, NY', users: 156, percentage: 12.5 },
      { location: 'Los Angeles, CA', users: 134, percentage: 10.8 },
      { location: 'Chicago, IL', users: 98, percentage: 7.9 },
      { location: 'Houston, TX', users: 87, percentage: 7.0 },
      { location: 'Phoenix, AZ', users: 76, percentage: 6.1 }
    ]
  };

  const trialMetrics = {
    trialPhases: [
      { phase: 'Phase I', count: 23, percentage: 14.7 },
      { phase: 'Phase II', count: 45, percentage: 28.8 },
      { phase: 'Phase III', count: 67, percentage: 42.9 },
      { phase: 'Phase IV', count: 21, percentage: 13.5 }
    ],
    trialStatus: [
      { status: 'Recruiting', count: 89, percentage: 57.1 },
      { status: 'Active', count: 45, percentage: 28.8 },
      { status: 'Completed', count: 18, percentage: 11.5 },
      { status: 'Terminated', count: 4, percentage: 2.6 }
    ],
    topConditions: [
      { condition: 'Cancer', trials: 34, applications: 567 },
      { condition: 'Cardiovascular', trials: 28, applications: 423 },
      { condition: 'Neurological', trials: 25, applications: 389 },
      { condition: 'Diabetes', trials: 22, applications: 312 },
      { condition: 'Autoimmune', trials: 19, applications: 267 }
    ]
  };

  const financialMetrics = {
    monthlyRevenue: [32000, 34500, 37800, 41200, 38900, 42300, 45600, 48900, 51200, 53400, 56700, 58900],
    revenueSources: [
      { source: 'Trial Sponsors', amount: 28900, percentage: 63.4 },
      { source: 'Patient Fees', amount: 12300, percentage: 27.0 },
      { source: 'Data Licensing', amount: 3200, percentage: 7.0 },
      { source: 'Consulting', amount: 1200, percentage: 2.6 }
    ],
    costBreakdown: [
      { category: 'Platform Development', amount: 15600, percentage: 34.2 },
      { category: 'AI Agent Costs', amount: 12300, percentage: 27.0 },
      { category: 'ICP Infrastructure', amount: 8900, percentage: 19.5 },
      { category: 'Marketing', amount: 5600, percentage: 12.3 },
      { category: 'Operations', amount: 3200, percentage: 7.0 }
    ]
  };

  const performanceMetrics = {
    platformUptime: 99.8,
    averageResponseTime: 1.2,
    userSatisfaction: 4.6,
    aiAgentAccuracy: 94.2,
    walletConnectionSuccess: 98.7,
    dataProcessingSpeed: 2.1
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-xl text-slate-600">Comprehensive insights into platform performance and user engagement</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Real-time Data
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Live Updates
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Target className="h-3 w-3 mr-1" />
            ICP Powered
          </Badge>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">Time Range:</span>
              <div className="flex space-x-2">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewMetrics.totalUsers)}</div>
            <p className="text-xs text-slate-600">
              +{overviewMetrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Target className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.activeTrials}</div>
            <p className="text-xs text-slate-600">
              {overviewMetrics.totalTrials} total trials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.successRate}%</div>
            <p className="text-xs text-slate-600">
              {formatNumber(overviewMetrics.totalApplications)} applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overviewMetrics.revenue)}</div>
            <p className="text-xs text-slate-600">
              +{overviewMetrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="trials">Trials</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>User Growth Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center space-y-2">
                    <LineChart className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="text-slate-500">User growth chart for {timeRange}</p>
                    <p className="text-sm text-slate-400">Mock data visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Trial Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trialMetrics.trialPhases.map((phase) => (
                    <div key={phase.phase} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{phase.phase}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${phase.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">
                          {phase.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-700">High Success Rate</h3>
                  <p className="text-sm text-slate-600">78.5% trial application success rate</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-700">Growing User Base</h3>
                  <p className="text-sm text-slate-600">1,247 registered users</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-700">Active Trials</h3>
                  <p className="text-sm text-slate-600">89 currently recruiting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Retention</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {userMetrics.userRetention}%
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {userMetrics.topLocations.map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <span className="text-sm">{location.location}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{location.users}</span>
                          <span className="text-xs text-slate-500">({location.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center space-y-2">
                    <BarChart className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="text-slate-500">User activity chart</p>
                    <p className="text-sm text-slate-400">Mock data visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trials Tab */}
        <TabsContent value="trials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trial Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trialMetrics.trialStatus.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status.status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${status.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">
                          {status.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Medical Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trialMetrics.topConditions.map((condition) => (
                    <div key={condition.condition} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{condition.condition}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{condition.trials} trials</div>
                        <div className="text-xs text-slate-500">{condition.applications} applications</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialMetrics.revenueSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {formatCurrency(source.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialMetrics.costBreakdown.map((cost) => (
                    <div key={cost.category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cost.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${cost.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {formatCurrency(cost.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center space-y-2">
                  <LineChartIcon className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="text-slate-500">Revenue trend chart for {timeRange}</p>
                  <p className="text-sm text-slate-400">Mock data visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Platform Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{performanceMetrics.platformUptime}%</div>
                <p className="text-xs text-slate-600">Excellent performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{performanceMetrics.averageResponseTime}s</div>
                <p className="text-xs text-slate-600">Fast response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">User Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{performanceMetrics.userSatisfaction}/5</div>
                <p className="text-xs text-slate-600">High satisfaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Agent Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{performanceMetrics.aiAgentAccuracy}%</div>
                <p className="text-xs text-slate-600">Highly accurate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Wallet Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{performanceMetrics.walletConnectionSuccess}%</div>
                <p className="text-xs text-slate-600">Reliable connection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{performanceMetrics.dataProcessingSpeed}s</div>
                <p className="text-xs text-slate-600">Fast processing</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Key Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">User Growth</h4>
                  <p className="text-sm text-blue-700">User base growing at 23.4% monthly rate</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Trial Success</h4>
                  <p className="text-sm text-green-700">High success rate indicates effective matching</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Revenue Growth</h4>
                  <p className="text-sm text-purple-700">Sustainable revenue model with multiple sources</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">User Retention</h4>
                  <p className="text-sm text-yellow-700">Focus on improving long-term user engagement</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-1">Geographic Expansion</h4>
                  <p className="text-sm text-orange-700">Expand beyond top 5 locations</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">Cost Optimization</h4>
                  <p className="text-sm text-red-700">Reduce platform development costs</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Immediate Actions</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Optimize AI agent response time</li>
                    <li>• Implement user feedback system</li>
                    <li>• Enhance mobile responsiveness</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Short-term Goals</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Increase user retention to 90%</li>
                    <li>• Expand to 10 new locations</li>
                    <li>• Launch referral program</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Long-term Strategy</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• International expansion</li>
                    <li>• Advanced AI capabilities</li>
                    <li>• Blockchain integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

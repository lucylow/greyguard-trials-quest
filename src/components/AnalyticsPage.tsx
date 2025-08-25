import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  MapPin,
  Brain,
  Shield,
  Network,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 15420,
      activeTrials: 89,
      totalMatches: 2347,
      revenue: 125000,
      growthRate: 23.5,
      conversionRate: 8.7
    },
    users: {
      newUsers: 1247,
      returningUsers: 892,
      userRetention: 78.3,
      topLocations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      userGrowth: [1200, 1350, 1420, 1540, 1680, 1820, 1950, 2100, 2240, 2380, 2510, 2650]
    },
    trials: {
      totalTrials: 89,
      recruitingTrials: 67,
      completedTrials: 12,
      pendingTrials: 10,
      trialCategories: [
        { name: 'Oncology', count: 23, percentage: 25.8 },
        { name: 'Cardiovascular', count: 18, percentage: 20.2 },
        { name: 'Neurology', count: 15, percentage: 16.9 },
        { name: 'Endocrinology', count: 12, percentage: 13.5 },
        { name: 'Other', count: 21, percentage: 23.6 }
      ]
    },
    revenue: {
      monthlyRevenue: 125000,
      revenueGrowth: 23.5,
      revenueSources: [
        { source: 'Subscription Fees', amount: 45000, percentage: 36.0 },
        { source: 'Trial Applications', amount: 38000, percentage: 30.4 },
        { source: 'Pharma Partnerships', amount: 25000, percentage: 20.0 },
        { source: 'Data Insights', amount: 17000, percentage: 13.6 }
      ],
      projectedAnnual: 1800000
    }
  };

  const metrics = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'trials', name: 'Trials', icon: Target },
    { id: 'revenue', name: 'Revenue', icon: DollarSign }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Platform Analytics</h1>
            <p className="text-xl text-slate-600">Real-time insights into GreyGuard Trials performance</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Real-time Updates
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Network className="h-3 w-3 mr-1" />
            ICP Powered
          </Badge>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-700">Time Range:</label>
              <div className="flex space-x-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedMetric === metric.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent className={`h-6 w-6 ${
                      selectedMetric === metric.id ? 'text-blue-500' : 'text-slate-500'
                    }`} />
                    <span className={`font-medium text-sm ${
                      selectedMetric === metric.id ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {metric.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      {selectedMetric === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{analyticsData.overview.growthRate}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.activeTrials}</div>
              <p className="text-xs text-muted-foreground">
                Currently recruiting participants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalMatches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Successful patient-trial connections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.overview.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.overview.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Analytics */}
      {selectedMetric === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  +{analyticsData.users.userRetention}%
                </div>
                <p className="text-sm text-slate-600">User Retention Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analyticsData.users.newUsers.toLocaleString()}
                </div>
                <p className="text-sm text-slate-600">This Month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returning Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {analyticsData.users.returningUsers.toLocaleString()}
                </div>
                <p className="text-sm text-slate-600">This Month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top User Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.users.topLocations.map((location, index) => (
                  <div key={location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{location}</span>
                    </div>
                    <Badge variant="outline">{Math.floor(Math.random() * 2000) + 500} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trial Analytics */}
      {selectedMetric === 'trials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Trials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {analyticsData.trials.totalTrials}
                </div>
                <p className="text-sm text-slate-600">All Time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruiting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analyticsData.trials.recruitingTrials}
                </div>
                <p className="text-sm text-slate-600">Active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {analyticsData.trials.completedTrials}
                </div>
                <p className="text-sm text-slate-600">Finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {analyticsData.trials.pendingTrials}
                </div>
                <p className="text-sm text-slate-600">Awaiting</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trial Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trials.trialCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{category.count} trials</span>
                      <Badge variant="outline">{category.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Analytics */}
      {selectedMetric === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    ${analyticsData.revenue.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Monthly Revenue</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    +{analyticsData.revenue.revenueGrowth}%
                  </div>
                  <p className="text-sm text-slate-600">Growth Rate</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    ${analyticsData.revenue.projectedAnnual.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Projected Annual</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.revenue.revenueSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="font-medium">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">
                          ${source.amount.toLocaleString()}
                        </span>
                        <Badge variant="outline">{source.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Revenue trend chart would be displayed here</p>
                  <p className="text-sm">Showing monthly growth and projections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Platform Health & Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-green-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-blue-600">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15,420</div>
              <div className="text-sm text-purple-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-orange-600">Live Trials</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Clock,
  BookOpen,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AdminOverviewPage = () => {
  const [stats, setStats] = useState({
    totalConcerns: 0,
    resolvedConcerns: 0,
    pendingConcerns: 0,
    inProgressConcerns: 0,
    totalUsers: 0,
    recentActivity: 0,
    responseRate: 0,
    averageResolutionTime: 0
  });
  
  const [chartData, setChartData] = useState({
    concernsByCategory: [],
    concernsByStatus: [],
    weeklyTrends: []
  });
  
  const [recentConcerns, setRecentConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch concerns data
      const { data: concerns, error: concernsError } = await supabase
        .from('concerns')
        .select('*');

      if (concernsError) throw concernsError;

      // Fetch recent concerns (last 5)
      const { data: recent, error: recentError } = await supabase
        .from('concerns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setRecentConcerns(recent || []);

      // Calculate statistics
      const total = concerns?.length || 0;
      const resolved = concerns?.filter(c => c.status?.toLowerCase() === 'resolved').length || 0;
      const pending = concerns?.filter(c => c.status?.toLowerCase() === 'pending').length || 0;
      const inProgress = concerns?.filter(c => c.status?.toLowerCase() === 'in progress').length || 0;

      // Calculate category breakdown
      const categoryBreakdown = concerns?.reduce((acc, concern) => {
        const category = concern.category || 'General';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const concernsByCategory = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value
      }));

      const concernsByStatus = [
        { name: 'Resolved', value: resolved, color: '#10B981' },
        { name: 'In Progress', value: inProgress, color: '#F59E0B' },
        { name: 'Pending', value: pending, color: '#EF4444' }
      ];

      // Calculate response rate
      const responseRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

      // Set statistics
      setStats({
        totalConcerns: total,
        resolvedConcerns: resolved,
        pendingConcerns: pending,
        inProgressConcerns: inProgress,
        totalUsers: 0, // This would need user data
        recentActivity: concerns?.filter(c => {
          const createdAt = new Date(c.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return createdAt > dayAgo;
        }).length || 0,
        responseRate,
        averageResolutionTime: 2.5 // This would need proper calculation
      });

      setChartData({
        concernsByCategory,
        concernsByStatus,
        weeklyTrends: [] // This would need time-series data
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time listener for concerns
    const concernsSubscription = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'concerns' },
        (payload) => {
          console.log('New concern added:', payload.new);
          setStats(prevStats => ({
            ...prevStats,
            totalConcerns: prevStats.totalConcerns + 1,
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'concerns' },
        (payload) => {
          console.log('Concern updated:', payload.new);
          const wasResolved = payload.old.status?.toLowerCase() !== 'resolved' && payload.new.status?.toLowerCase() === 'resolved';
          if (wasResolved) {
            setStats(prevStats => ({
              ...prevStats,
              resolvedConcerns: prevStats.resolvedConcerns + 1,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(concernsSubscription);
    };
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = "blue", trend = null }) => (
    <Card className={`border-l-4 border-l-${color}-500 hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last week
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );

  const SimpleBarChart = ({ data, title }) => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium">{item.name}</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max((item.value / Math.max(...data.map(d => d.value))) * 100, 5)}%` 
                    }}
                  />
                </div>
              </div>
              <div className="w-12 text-sm font-bold text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SimpleDonutChart = ({ data, title }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage student concerns</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          title="Total Concerns" 
          value={stats.totalConcerns} 
          icon={MessageSquare} 
          color="blue"
          trend={5}
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolvedConcerns} 
          icon={CheckCircle} 
          color="green"
          trend={12}
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressConcerns} 
          icon={Clock} 
          color="yellow"
          trend={-3}
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingConcerns} 
          icon={AlertTriangle} 
          color="red"
          trend={-8}
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <SimpleBarChart 
          data={chartData.concernsByCategory} 
          title="Concerns by Category"
        />
        <SimpleDonutChart 
          data={chartData.concernsByStatus} 
          title="Status Distribution"
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Concerns
            </CardTitle>
            <CardDescription>Latest submissions requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConcerns.length > 0 ? (
                recentConcerns.map((concern) => (
                  <div key={concern.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{concern.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        By {concern.student_name || 'Anonymous'} • {new Date(concern.created_at).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        concern.status?.toLowerCase() === 'resolved' 
                          ? 'bg-green-100 text-green-600' 
                          : concern.status?.toLowerCase() === 'in progress'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {concern.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent concerns</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <span className="font-bold">{stats.responseRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg. Resolution Time</span>
                <span className="font-bold">{stats.averageResolutionTime} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Activity (24h)</span>
                <span className="font-bold">{stats.recentActivity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Active Users</span>
                <span className="font-bold">{stats.totalUsers || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminOverviewPage;

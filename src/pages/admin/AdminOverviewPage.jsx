
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  HelpCircle,
  BarChartBig,
  ListChecks,
  Sigma,
  BookCopy,
  Percent,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Loader2 } from "lucide-react";

const StatCard = ({ title, value, icon, description, isLoading, trend, color = "primary" }) => {
  const IconComponent = icon;
  const colorClasses = {
    primary: "text-primary",
    green: "text-green-600",
    blue: "text-blue-600",
    orange: "text-orange-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <IconComponent className={`h-5 w-5 ${colorClasses[color]}`} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{value}</div>
              {trend && (
                <div className={`flex items-center text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trend.value}% from last week
                </div>
              )}
              {description && !isLoading && (
                <p className="text-xs text-muted-foreground pt-1">{description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminOverviewPage = () => {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
    totalConcerns: 0,
    resolvedConcerns: 0,
    totalReplies: 0,
    totalVotes: 0,
    activeStudents: 0,
  });
  const [chartData, setChartData] = useState({
    scoreDistribution: [],
    topQuizzes: [],
    concernsOverTime: [],
    subjectPerformance: [],
    concernsByCategory: [],
    weeklyActivity: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingStats(true);
      setLoadingCharts(true);

      try {
        // Fetch quiz data
        const { data: questionsData, error: questionsError } = await supabase
          .from("quizzes")
          .select("subject_name, quiz_title, id");

        if (questionsError) throw questionsError;

        const uniqueSubjects = new Set(questionsData.map((q) => q.subject_name));
        const uniqueQuizzes = new Set(questionsData.map((q) => `${q.subject_name}-${q.quiz_title}`));

        // Fetch responses data
        const { data: responsesData, error: responsesError } = await supabase
          .from("quiz_responses")
          .select("subject_name, score, total_questions, timestamp, quiz_title, name");

        if (responsesError) throw responsesError;

        // Fetch concerns data
        const { data: concernsData, error: concernsError } = await supabase
          .from("concerns")
          .select("*, helpful_votes, not_helpful_votes, status, category, created_at");

        if (concernsError) throw concernsError;

        // Fetch replies data
        const { data: repliesData, error: repliesError } = await supabase
          .from("concern_replies")
          .select("*");

        if (repliesError) console.warn("Could not fetch replies:", repliesError);

        // Calculate stats
        let totalScoreSum = 0;
        let totalPossibleScoreSum = 0;
        const uniqueStudents = new Set();

        responsesData.forEach((r) => {
          totalScoreSum += r.score;
          totalPossibleScoreSum += r.total_questions;
          if (r.name) uniqueStudents.add(r.name);
        });

        const averageScore = totalPossibleScoreSum > 0 
          ? ((totalScoreSum / totalPossibleScoreSum) * 100).toFixed(2) 
          : 0;

        const resolvedConcerns = concernsData.filter(c => c.status?.toLowerCase() === 'resolved').length;
        const totalVotes = concernsData.reduce((sum, c) => 
          sum + (c.helpful_votes || 0) + (c.not_helpful_votes || 0), 0);

        setStats({
          totalSubjects: uniqueSubjects.size,
          totalQuizzes: uniqueQuizzes.size,
          totalQuestions: questionsData.length,
          totalAttempts: responsesData.length,
          averageScore: `${averageScore}%`,
          totalConcerns: concernsData.length,
          resolvedConcerns,
          totalReplies: repliesData?.length || 0,
          totalVotes,
          activeStudents: uniqueStudents.size,
        });
        setLoadingStats(false);

        // Prepare chart data
        // Score distribution by subject
        const scoreDistData = responsesData.reduce((acc, curr) => {
          const subject = curr.subject_name;
          if (!acc[subject]) {
            acc[subject] = { name: subject, totalScore: 0, totalAttempts: 0, totalPossible: 0 };
          }
          acc[subject].totalScore += curr.score;
          acc[subject].totalAttempts += 1;
          acc[subject].totalPossible += curr.total_questions;
          return acc;
        }, {});

        const finalScoreDist = Object.values(scoreDistData).map((s) => ({
          name: s.name,
          averageScore: s.totalPossible > 0 
            ? parseFloat(((s.totalScore / s.totalPossible) * 100).toFixed(2)) 
            : 0,
          attempts: s.totalAttempts,
        }));

        // Top quizzes by attempts
        const quizAttemptsCount = responsesData.reduce((acc, curr) => {
          const quizKey = `${curr.subject_name} - ${curr.quiz_title || "General"}`;
          acc[quizKey] = (acc[quizKey] || 0) + 1;
          return acc;
        }, {});

        const sortedTopQuizzes = Object.entries(quizAttemptsCount)
          .map(([name, attempts]) => ({ name, attempts }))
          .sort((a, b) => b.attempts - a.attempts)
          .slice(0, 5);

        // Concerns by category
        const concernsByCategory = concernsData.reduce((acc, concern) => {
          const category = concern.category || 'General';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const concernsCategoryData = Object.entries(concernsByCategory)
          .map(([name, value]) => ({ name, value }));

        // Weekly activity (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const weeklyActivity = last7Days.map(date => {
          const quizAttempts = responsesData.filter(r => 
            r.timestamp?.startsWith(date)
          ).length;
          const newConcerns = concernsData.filter(c => 
            c.created_at?.startsWith(date)
          ).length;
          
          return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            quizAttempts,
            concerns: newConcerns,
          };
        });

        setChartData({
          scoreDistribution: finalScoreDist,
          topQuizzes: sortedTopQuizzes,
          concernsByCategory: concernsCategoryData,
          subjectPerformance: finalScoreDist,
          weeklyActivity,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingStats(false);
        setLoadingCharts(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Enhanced Dashboard Overview</h1>
        <Button onClick={() => window.location.reload()} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects}
          icon={BookCopy}
          isLoading={loadingStats}
          description="Unique subjects with quizzes"
          color="blue"
        />
        <StatCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          icon={ListChecks}
          isLoading={loadingStats}
          description="Distinct quizzes created"
          color="green"
        />
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={HelpCircle}
          isLoading={loadingStats}
          description="Across all subjects"
          color="purple"
        />
        <StatCard
          title="Quiz Attempts"
          value={stats.totalAttempts}
          icon={Users}
          isLoading={loadingStats}
          description="Student responses recorded"
          color="orange"
        />
        <StatCard
          title="Average Score"
          value={stats.averageScore}
          icon={Percent}
          isLoading={loadingStats}
          description="Overall performance"
          color="primary"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          isLoading={loadingStats}
          description="Unique participants"
          color="green"
        />
        <StatCard
          title="Total Concerns"
          value={stats.totalConcerns}
          icon={AlertTriangle}
          isLoading={loadingStats}
          description="Student concerns raised"
          color="orange"
        />
        <StatCard
          title="Resolved Issues"
          value={stats.resolvedConcerns}
          icon={CheckCircle}
          isLoading={loadingStats}
          description="Successfully addressed"
          color="green"
        />
        <StatCard
          title="Total Replies"
          value={stats.totalReplies}
          icon={MessageSquare}
          isLoading={loadingStats}
          description="Admin responses"
          color="blue"
        />
        <StatCard
          title="Community Votes"
          value={stats.totalVotes}
          icon={ThumbsUp}
          isLoading={loadingStats}
          description="Helpful ratings"
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {/* Weekly Activity */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Quiz attempts and concerns over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="quizAttempts" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Quiz Attempts"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="concerns" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="New Concerns"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Quizzes */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Attempted Quizzes</CardTitle>
            <CardDescription>Most popular quizzes by student participation</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : chartData.topQuizzes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.topQuizzes} layout="vertical" margin={{ right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} interval={0} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attempts" fill="#8884d8" name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No quiz data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average scores and participation by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : chartData.subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="averageScore" stroke="#8884d8" name="Avg Score %" />
                  <Line type="monotone" dataKey="attempts" stroke="#82ca9d" name="Total Attempts" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No performance data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Concerns by Category */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Concerns Distribution</CardTitle>
            <CardDescription>Breakdown of concerns by category</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : chartData.concernsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.concernsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.concernsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No concerns data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminOverviewPage;

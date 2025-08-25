
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  TrendingUp,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

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

        // Top performing quizzes
        const quizPerformance = responsesData.reduce((acc, curr) => {
          const quizKey = `${curr.subject_name} - ${curr.quiz_title}`;
          if (!acc[quizKey]) {
            acc[quizKey] = { name: quizKey, totalScore: 0, totalAttempts: 0, totalPossible: 0 };
          }
          acc[quizKey].totalScore += curr.score;
          acc[quizKey].totalAttempts += 1;
          acc[quizKey].totalPossible += curr.total_questions;
          return acc;
        }, {});

        const sortedTopQuizzes = Object.values(quizPerformance)
          .map((q) => ({
            name: q.name,
            averageScore: q.totalPossible > 0 
              ? parseFloat(((q.totalScore / q.totalPossible) * 100).toFixed(2)) 
              : 0,
            attempts: q.totalAttempts,
          }))
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 5);

        // Concerns by category
        const concernsCategoryData = concernsData.reduce((acc, curr) => {
          const category = curr.category || 'general';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const concernsCategoryChart = Object.entries(concernsCategoryData).map(([name, value]) => ({
          name,
          value,
        }));

        // Weekly activity data
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
          concernsByCategory: concernsCategoryChart,
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalSubjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.averageScore}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Concerns</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalConcerns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Concerns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : stats.resolvedConcerns}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {chartData.scoreDistribution.map((subject, index) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${subject.averageScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.averageScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {chartData.weeklyActivity.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day.date}</span>
                    <div className="flex gap-4 text-sm">
                      <span>Quizzes: {day.quizAttempts}</span>
                      <span>Concerns: {day.concerns}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminOverviewPage;

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

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
    totalViews: 0,
  });
  const [chartData, setChartData] = useState({
    scoreDistribution: [],
    topQuizzes: [],
    concernsOverTime: [],
    subjectPerformance: [],
    concernsByCategory: [],
    weeklyActivity: [],
    quizViews: [],
    concernsResolutionTime: [],
    studentActivity: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingStats(true);
      setLoadingCharts(true);

      try {
        // Fetch basic concerns statistics
        const { data: concernsData, error: concernsError } = await supabase
          .from("concerns")
          .select("status, created_at, category, helpful_votes, not_helpful_votes, resolved_at");

        if (concernsError) throw concernsError;

        // Fetch quiz data with error handling
        let quizzesData = [];
        try {
          const { data, error } = await supabase
            .from("quizzes")
            .select("subject_name, quiz_title, id, views");

          if (!error) {
            quizzesData = data || [];
          }
        } catch (err) {
          console.warn("Views column may not exist, fetching without it:", err);
          const { data } = await supabase
            .from("quizzes")
            .select("subject_name, quiz_title, id");
          quizzesData = (data || []).map(quiz => ({ ...quiz, views: 0 }));
        }

        const uniqueSubjects = new Set(quizzesData.map((q) => q.subject_name));
        const uniqueQuizzes = new Set(quizzesData.map((q) => `${q.subject_name}-${q.quiz_title}`));
        const totalViews = quizzesData.reduce((sum, q) => sum + (q.views || 0), 0);

        // Fetch quiz responses
        const { data: responsesData, error: responsesError } = await supabase
          .from("quiz_responses")
          .select("timestamp, score, quiz_title, subject_name, name");

        if (responsesError) throw responsesError;

        // Fetch questions data with error handling
        let questionsData = [];
        try {
          const { data, error } = await supabase
            .from("quiz_questions")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error) {
            questionsData = data || [];
          }
        } catch (err) {
          console.warn("quiz_questions table may not exist:", err);
        }

        // Fetch subjects with error handling
        let subjectsData = [];
        try {
          const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .order("subject_name", { ascending: true });

          if (!error) {
            subjectsData = data || [];
          }
        } catch (err) {
          console.warn("subjects table may not exist:", err);
        }

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

        // Calculate average resolution time
        const resolvedConcernsData = concernsData.filter(c => c.status?.toLowerCase() === 'resolved' && c.created_at && c.resolved_at);
        const resolutionTimes = resolvedConcernsData.map(c => {
          const createdAt = new Date(c.created_at);
          const resolvedAt = new Date(c.resolved_at);
          return (resolvedAt - createdAt) / (1000 * 60 * 60); // Resolution time in hours
        });
        const averageResolutionTime = resolutionTimes.length > 0
          ? (resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length).toFixed(2)
          : 0;


        setStats({
          totalSubjects: uniqueSubjects.size,
          totalQuizzes: uniqueQuizzes.size,
          totalQuestions: questionsData.length, // Using questionsData length as total questions
          totalAttempts: responsesData.length,
          averageScore: `${averageScore}%`,
          totalConcerns: concernsData.length,
          resolvedConcerns,
          totalReplies: repliesData?.length || 0,
          totalVotes,
          activeStudents: uniqueStudents.size,
          totalViews: totalViews,
          averageResolutionTime: `${averageResolutionTime} hours`,
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

        // Top viewed quizzes
        const sortedQuizViews = quizzesData
          .map(q => ({
            name: `${q.subject_name} - ${q.quiz_title}`,
            views: q.views || 0,
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Concerns by category
        const concernsCategoryData = concernsData.reduce((acc, curr) => {
          const category = curr.category || 'General';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const concernsCategoryChart = Object.entries(concernsCategoryData).map(([name, value]) => ({
          name,
          value,
        }));

        // Concerns over time
        const concernsTimeline = concernsData.reduce((acc, curr) => {
          const date = curr.created_at ? curr.created_at.split('T')[0] : null;
          if (date) {
            if (!acc[date]) {
              acc[date] = { date, newConcerns: 0, resolvedConcerns: 0 };
            }
            if (curr.status?.toLowerCase() === 'resolved') {
              acc[date].resolvedConcerns++;
            } else {
              acc[date].newConcerns++;
            }
          }
          return acc;
        }, {});

        const sortedConcernsTimeline = Object.entries(concernsTimeline)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([date, values]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            newConcerns: values.newConcerns,
            resolvedConcerns: values.resolvedConcerns,
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

        // Student Activity (example: number of attempts per student)
        const studentActivityData = responsesData.reduce((acc, curr) => {
            const studentName = curr.name || 'Anonymous';
            if (!acc[studentName]) {
                acc[studentName] = { name: studentName, attempts: 0 };
            }
            acc[studentName].attempts++;
            return acc;
        }, {});

        const sortedStudentActivity = Object.values(studentActivityData)
          .sort((a, b) => b.attempts - a.attempts)
          .slice(0, 5);


        setChartData({
          scoreDistribution: finalScoreDist,
          topQuizzes: sortedTopQuizzes,
          concernsByCategory: concernsCategoryChart,
          subjectPerformance: finalScoreDist, // Reusing scoreDist for subject performance
          weeklyActivity,
          quizViews: sortedQuizViews,
          concernsOverTime: sortedConcernsTimeline,
          concernsResolutionTime: resolvedConcernsData.map(c => ({
            date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
            resolutionTime: (new Date(c.resolved_at) - new Date(c.created_at)) / (1000 * 60 * 60),
          })),
          studentActivity: sortedStudentActivity,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Optionally set error states here
      } finally {
        setLoadingStats(false);
        setLoadingCharts(false);
      }
    };

    fetchDashboardData();

    // Real-time listener for concerns
    const concernsSubscription = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'concerns' },
        (payload) => {
          console.log('New concern added:', payload.new);
          // Update stats and charts based on new concern
          // This is a simplified update; a more robust solution would refetch or carefully merge data
          setStats(prevStats => ({
            ...prevStats,
            totalConcerns: prevStats.totalConcerns + 1,
          }));
          // Re-fetch or update chart data if necessary
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'concerns' },
        (payload) => {
          console.log('Concern updated:', payload.new);
           // Update stats and charts based on updated concern (e.g., status change)
           const wasResolved = payload.old.status?.toLowerCase() !== 'resolved' && payload.new.status?.toLowerCase() === 'resolved';
           if (wasResolved) {
               setStats(prevStats => ({
                   ...prevStats,
                   resolvedConcerns: prevStats.resolvedConcerns + 1,
               }));
               // Update resolution time chart if needed
           }
        }
      )
      .subscribe();

    // Real-time listener for replies
    const repliesSubscription = supabase
      .channel('custom-insert-channel-replies')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'concern_replies' },
        (payload) => {
          console.log('New reply added:', payload.new);
          setStats(prevStats => ({
            ...prevStats,
            totalReplies: prevStats.totalReplies + 1,
          }));
        }
      )
      .subscribe();

      // Real-time listener for quiz responses
      const responsesSubscription = supabase
      .channel('custom-insert-channel-responses')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'quiz_responses' },
        (payload) => {
          console.log('New quiz response:', payload.new);
          // Update stats based on new response
          setStats(prevStats => {
            const newScore = payload.new.score || 0;
            const newTotalQuestions = payload.new.total_questions || 0;
            const currentTotalAttempts = prevStats.totalAttempts;
            // Approximate current sum and possible sum for average calculation
            let currentTotalScoreSum = 0;
            let currentTotalPossibleScoreSum = 0;

            if (prevStats.averageScore && prevStats.averageScore.endsWith('%')) {
              const avg = parseFloat(prevStats.averageScore);
              if (!isNaN(avg) && currentTotalAttempts > 0) {
                currentTotalScoreSum = (avg / 100) * currentTotalAttempts * (prevStats.totalQuestions > 0 ? (prevStats.totalQuestions / currentTotalAttempts) : 1); // Approximation
                currentTotalPossibleScoreSum = currentTotalAttempts * (prevStats.totalQuestions > 0 ? (prevStats.totalQuestions / currentTotalAttempts) : 1); // Approximation
              }
            }


            const updatedTotalAttempts = currentTotalAttempts + 1;
            const updatedTotalScoreSum = currentTotalScoreSum + newScore;
            const updatedTotalPossibleScoreSum = currentTotalPossibleScoreSum + newTotalQuestions;

            const updatedAverageScore = updatedTotalPossibleScoreSum > 0
              ? ((updatedTotalScoreSum / updatedTotalPossibleScoreSum) * 100).toFixed(2)
              : 0;

            return {
              ...prevStats,
              totalAttempts: updatedTotalAttempts,
              averageScore: `${updatedAverageScore}%`,
            };
          });
          // Update charts if necessary
        }
      )
      .subscribe();


    return () => {
      supabase.removeChannel(concernsSubscription);
      supabase.removeChannel(repliesSubscription);
      supabase.removeChannel(responsesSubscription);
    };
  }, []);

  const renderCustomPieChart = (data, dataKey, nameKey) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderCustomBarChart = (data, xAxisKey, yAxisKey, tooltipFormatter) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Bar dataKey={yAxisKey} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderCustomLineChart = (data, xAxisKey, yAxisKey, tooltipFormatter) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

    const renderCustomAreaChart = (data, xAxisKey, yAxisKey, tooltipFormatter) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Area type="monotone" dataKey={yAxisKey} stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };


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
            <CardDescription>Average score and attempts per subject</CardDescription>
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
            <CardDescription>Quiz attempts and concerns raised daily</CardDescription>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Viewed Quizzes</CardTitle>
            <CardDescription>Most viewed quizzes in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomBarChart(chartData.quizViews, "name", "views", (value) => `${value} views`)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concerns by Category</CardTitle>
            <CardDescription>Distribution of concerns across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomPieChart(chartData.concernsByCategory, "value", "name")
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concerns Over Time</CardTitle>
            <CardDescription>New and resolved concerns daily</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomLineChart(chartData.concernsOverTime, "date", "newConcerns", (value) => `${value} new concerns`)
            )}
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
          <CardHeader>
            <CardTitle>Top Performing Quizzes</CardTitle>
            <CardDescription>Quizzes with the highest average scores</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomBarChart(chartData.topQuizzes, "name", "averageScore", (value) => `${value}% average score`)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Activity</CardTitle>
            <CardDescription>Top students by number of quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomBarChart(chartData.studentActivity, "name", "attempts", (value) => `${value} attempts`)
            )}
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1">
         <Card>
          <CardHeader>
            <CardTitle>Concern Resolution Time</CardTitle>
            <CardDescription>Time taken to resolve concerns</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="h-48 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              renderCustomAreaChart(chartData.concernsResolutionTime, "date", "resolutionTime", (value) => `${value} hours`)
            )}
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
};

export default AdminOverviewPage;
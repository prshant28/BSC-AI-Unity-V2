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
import {
  Users,
  HelpCircle,
  BarChartBig,
  ListChecks,
  Sigma,
  BookCopy,
  Percent,
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
} from "recharts";
import { Loader2 } from "lucide-react";

const StatCard = ({ title, value, icon, description, isLoading }) => {
  const IconComponent = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <IconComponent className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <div className="text-3xl font-bold text-foreground">{value}</div>
          )}
          {description && !isLoading && (
            <p className="text-xs text-muted-foreground pt-1">{description}</p>
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
  });
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingStats(true);
      setLoadingCharts(true);

      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from("quizzes")
          .select("subject_name, quiz_title, id");

        if (questionsError) throw questionsError;

        const uniqueSubjects = new Set(
          questionsData.map((q) => q.subject_name),
        );
        const uniqueQuizzes = new Set(
          questionsData.map((q) => `${q.subject_name}-${q.quiz_title}`),
        );

        const { data: responsesData, error: responsesError } = await supabase
          .from("quiz_responses")
          .select(
            "subject_name, score, total_questions, timestamp, quiz_title",
          );

        if (responsesError) throw responsesError;

        let totalScoreSum = 0;
        let totalPossibleScoreSum = 0;
        responsesData.forEach((r) => {
          totalScoreSum += r.score;
          totalPossibleScoreSum += r.total_questions;
        });
        const averageScore =
          totalPossibleScoreSum > 0
            ? ((totalScoreSum / totalPossibleScoreSum) * 100).toFixed(2)
            : 0;

        setStats({
          totalSubjects: uniqueSubjects.size,
          totalQuizzes: uniqueQuizzes.size,
          totalQuestions: questionsData.length,
          totalAttempts: responsesData.length,
          averageScore: `${averageScore}%`,
        });
        setLoadingStats(false);

        // Prepare data for charts
        const scoreDistData = responsesData.reduce((acc, curr) => {
          const subject = curr.subject_name;
          if (!acc[subject]) {
            acc[subject] = {
              name: subject,
              totalScore: 0,
              totalAttempts: 0,
              totalPossible: 0,
            };
          }
          acc[subject].totalScore += curr.score;
          acc[subject].totalAttempts += 1;
          acc[subject].totalPossible += curr.total_questions;
          return acc;
        }, {});

        const finalScoreDist = Object.values(scoreDistData).map((s) => ({
          name: s.name,
          averageScore:
            s.totalPossible > 0
              ? parseFloat(((s.totalScore / s.totalPossible) * 100).toFixed(2))
              : 0,
        }));
        setScoreDistribution(finalScoreDist);

        const quizAttemptsCount = responsesData.reduce((acc, curr) => {
          const quizKey = `${curr.subject_name} - ${curr.quiz_title || "General"}`;
          acc[quizKey] = (acc[quizKey] || 0) + 1;
          return acc;
        }, {});

        const sortedTopQuizzes = Object.entries(quizAttemptsCount)
          .map(([name, attempts]) => ({ name, attempts }))
          .sort((a, b) => b.attempts - a.attempts)
          .slice(0, 5);
        setTopQuizzes(sortedTopQuizzes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Handle error state if needed
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
      <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects}
          icon={BookCopy}
          isLoading={loadingStats}
          description="Unique subjects with quizzes."
        />
        <StatCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          icon={ListChecks}
          isLoading={loadingStats}
          description="Distinct quizzes created."
        />
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={HelpCircle}
          isLoading={loadingStats}
          description="Across all subjects and quizzes."
        />
        <StatCard
          title="Total Student Attempts"
          value={stats.totalAttempts}
          icon={Users}
          isLoading={loadingStats}
          description="Quiz responses recorded."
        />
        <StatCard
          title="Average Quiz Score"
          value={stats.averageScore}
          icon={Percent}
          isLoading={loadingStats}
          description="Across all submitted attempts."
        />
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow col-span-1 lg:col-span-1 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Attempted Quizzes</CardTitle>
            <CardDescription>
              Based on the number of student submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : topQuizzes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topQuizzes}
                  layout="vertical"
                  margin={{ right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attempts" fill="#8884d8" name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                No quiz attempt data available yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow col-span-1 lg:col-span-1 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Average Score Distribution by Subject</CardTitle>
            <CardDescription>
              Average percentage scores for each subject.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCharts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : scoreDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="averageScore"
                    nameKey="name"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.averageScore}%`,
                      `Avg. Score (${props.payload.name})`,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                No score data available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminOverviewPage;

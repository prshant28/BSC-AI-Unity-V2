
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Medal, Award, RefreshCw, Loader2, TrendingUp } from "lucide-react";

const AdminLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuizzes: 0,
    averageScore: 0,
  });
  const { toast } = useToast();

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("*");

      if (error) throw error;

      // Process data to create leaderboard
      const studentStats = {};
      
      data.forEach(response => {
        const studentName = response.student_name;
        if (!studentStats[studentName]) {
          studentStats[studentName] = {
            name: studentName,
            totalQuizzes: 0,
            totalScore: 0,
            totalPossible: 0,
            averageScore: 0,
            subjects: new Set(),
          };
        }
        
        studentStats[studentName].totalQuizzes += 1;
        studentStats[studentName].totalScore += response.score;
        studentStats[studentName].totalPossible += response.total_questions;
        studentStats[studentName].subjects.add(response.subject_name);
      });

      // Calculate averages and sort
      const leaderboardData = Object.values(studentStats)
        .map(student => ({
          ...student,
          averageScore: student.totalPossible > 0 
            ? Math.round((student.totalScore / student.totalPossible) * 100) 
            : 0,
          subjectCount: student.subjects.size,
        }))
        .sort((a, b) => b.averageScore - a.averageScore);

      setLeaderboard(leaderboardData);

      // Calculate overall stats
      const totalStudents = leaderboardData.length;
      const totalQuizzes = data.length;
      const averageScore = totalStudents > 0 
        ? Math.round(leaderboardData.reduce((sum, student) => sum + student.averageScore, 0) / totalStudents)
        : 0;

      setStats({ totalStudents, totalQuizzes, averageScore });
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leaderboard data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">Student performance rankings and statistics</p>
        </div>
        <Button onClick={fetchLeaderboardData} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quiz Attempts</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((student, index) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index < 3 ? 'bg-gradient-to-r from-primary/5 to-primary/10' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.totalQuizzes} quiz{student.totalQuizzes !== 1 ? 'es' : ''} • {student.subjectCount} subject{student.subjectCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.totalScore}/{student.totalPossible} points
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center text-muted-foreground py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg">No student data available</p>
                <p className="text-sm">Rankings will appear once students start taking quizzes</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AdminLeaderboardPage;

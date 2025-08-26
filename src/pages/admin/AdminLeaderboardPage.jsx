
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";

const AdminLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const { data: responses, error } = await supabase
          .from("quiz_responses")
          .select("name, score, total_questions, subject_name, quiz_title, timestamp");

        if (error) throw error;

        // Group by student and calculate statistics
        const studentStats = responses.reduce((acc, response) => {
          const studentName = response.name || "Anonymous";
          if (!acc[studentName]) {
            acc[studentName] = {
              name: studentName,
              totalScore: 0,
              totalQuestions: 0,
              attempts: 0,
              subjects: new Set(),
            };
          }
          
          acc[studentName].totalScore += response.score;
          acc[studentName].totalQuestions += response.total_questions;
          acc[studentName].attempts += 1;
          acc[studentName].subjects.add(response.subject_name);
          
          return acc;
        }, {});

        // Convert to array and calculate percentages
        const leaderboardData = Object.values(studentStats)
          .map(student => ({
            ...student,
            averageScore: student.totalQuestions > 0 
              ? ((student.totalScore / student.totalQuestions) * 100).toFixed(1)
              : 0,
            subjectsCount: student.subjects.size,
          }))
          .sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));

        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Student Leaderboard</h1>
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>

      <div className="grid gap-4">
        {leaderboard.map((student, index) => (
          <Card key={student.name} className={`${index < 3 ? 'border-primary/50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    <span className="text-2xl font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.attempts} attempts • {student.subjectsCount} subjects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {student.averageScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {student.totalScore}/{student.totalQuestions} points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quiz responses found yet.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AdminLeaderboardPage;

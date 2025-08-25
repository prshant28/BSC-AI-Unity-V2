import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trophy, BarChartHorizontalBig, Download } from "lucide-react";
import Papa from "papaparse";

const AdminLeaderboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("");

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [averageScore, setAverageScore] = useState(0);

  const { toast } = useToast();

  const fetchSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    const { data, error } = await supabase
      .from("quiz_responses")
      .select("subject_name")
      .distinctOn("subject_name");
    if (error) {
      toast({
        title: "Error fetching subjects",
        description: error.message,
        variant: "destructive",
      });
      setSubjects([]);
    } else {
      setSubjects(data.map((s) => s.subject_name).filter(Boolean) || []);
    }
    setLoadingSubjects(false);
  }, [toast]);

  const fetchQuizzesForSubject = useCallback(
    async (subjectName) => {
      if (!subjectName) {
        setQuizzes([]);
        return;
      }
      setLoadingQuizzes(true);
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("quiz_title")
        .eq("subject_name", subjectName)
        .distinctOn("quiz_title");

      if (error) {
        toast({
          title: "Error fetching quizzes",
          description: error.message,
          variant: "destructive",
        });
        setQuizzes([]);
      } else {
        setQuizzes(data.map((q) => q.quiz_title).filter(Boolean) || []);
      }
      setLoadingQuizzes(false);
    },
    [toast],
  );

  const fetchLeaderboard = useCallback(
    async (subjectName, quizTitle) => {
      if (!subjectName || !quizTitle) {
        setLeaderboardData([]);
        setAverageScore(0);
        return;
      }
      setLoadingLeaderboard(true);
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("name, roll_number, score, total_questions, timestamp")
        .eq("subject_name", subjectName)
        .eq("quiz_title", quizTitle)
        .order("score", { ascending: false })
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error fetching leaderboard",
          description: error.message,
          variant: "destructive",
        });
        setLeaderboardData([]);
        setAverageScore(0);
      } else {
        const rankedData = data.map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
        setLeaderboardData(rankedData);

        if (data.length > 0) {
          const totalScoreSum = data.reduce((sum, item) => sum + item.score, 0);
          const totalPossibleScoreSum = data.reduce(
            (sum, item) => sum + item.total_questions,
            0,
          );
          const avg =
            totalPossibleScoreSum > 0
              ? (totalScoreSum / totalPossibleScoreSum) * 100
              : 0;
          setAverageScore(avg);
        } else {
          setAverageScore(0);
        }
      }
      setLoadingLeaderboard(false);
    },
    [toast],
  );

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuizzesForSubject(selectedSubject);
      setSelectedQuizTitle("");
      setLeaderboardData([]);
      setAverageScore(0);
    } else {
      setQuizzes([]);
      setLeaderboardData([]);
      setAverageScore(0);
      setSelectedQuizTitle("");
    }
  }, [selectedSubject, fetchQuizzesForSubject]);

  useEffect(() => {
    if (selectedSubject && selectedQuizTitle) {
      fetchLeaderboard(selectedSubject, selectedQuizTitle);
    } else {
      setLeaderboardData([]);
      setAverageScore(0);
    }
  }, [selectedSubject, selectedQuizTitle, fetchLeaderboard]);

  const handleExportLeaderboard = () => {
    if (leaderboardData.length === 0) {
      toast({ title: "No data to export", variant: "warning" });
      return;
    }
    const csvData = Papa.unparse(
      leaderboardData.map((r) => ({
        Rank: r.rank,
        Name: r.name,
        RollNo: r.roll_number,
        Score: r.score,
        TotalQuestions: r.total_questions,
        SubmittedAt: new Date(r.timestamp).toLocaleString(),
      })),
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `leaderboard_${selectedSubject}_${selectedQuizTitle}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Leaderboard Exported",
      description: "Leaderboard data downloaded.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-foreground">Quiz Leaderboards</h1>

      <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Select Quiz</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="subjectSelectLeaderboard">Subject</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={loadingSubjects}
            >
              <SelectTrigger id="subjectSelectLeaderboard">
                <SelectValue
                  placeholder={
                    loadingSubjects
                      ? "Loading..."
                      : subjects.length > 0
                        ? "Select Subject"
                        : "No Subjects with Responses"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subjects.length > 0 ? (
                  subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No subjects with responses
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quizSelectLeaderboard">Quiz</Label>
            <Select
              value={selectedQuizTitle}
              onValueChange={setSelectedQuizTitle}
              disabled={!selectedSubject || loadingQuizzes}
            >
              <SelectTrigger id="quizSelectLeaderboard">
                <SelectValue
                  placeholder={
                    !selectedSubject
                      ? "Select Subject First"
                      : loadingQuizzes
                        ? "Loading..."
                        : quizzes.length > 0
                          ? "Select Quiz"
                          : "No Quizzes with Responses"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {quizzes.length > 0 ? (
                  quizzes.map((qTitle) => (
                    <SelectItem key={qTitle} value={qTitle}>
                      {qTitle}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No quizzes with responses
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExportLeaderboard}
            variant="outline"
            disabled={leaderboardData.length === 0 || loadingLeaderboard}
          >
            <Download className="mr-2 h-4 w-4" /> Export Leaderboard
          </Button>
        </CardContent>
      </Card>

      {selectedSubject && selectedQuizTitle && (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Leaderboard: {selectedQuizTitle} ({selectedSubject})
              {averageScore > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  Avg. Score: {averageScore.toFixed(2)}%
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Top 21 students ranked by score and submission time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLeaderboard ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : leaderboardData.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No submissions yet for this quiz.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.slice(0, 21).map((item) => (
                      <TableRow
                        key={item.roll_number + item.timestamp}
                        className={
                          item.rank === 1
                            ? "bg-yellow-500/10 dark:bg-yellow-400/10"
                            : ""
                        }
                      >
                        <TableCell className="font-bold">
                          {item.rank === 1 && (
                            <Trophy className="inline mr-1 h-4 w-4 text-yellow-500" />
                          )}
                          {item.rank}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.roll_number}</TableCell>
                        <TableCell>
                          {item.score} / {item.total_questions}
                        </TableCell>
                        <TableCell>
                          {new Date(item.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {(!selectedSubject || !selectedQuizTitle) &&
        !loadingSubjects &&
        !loadingQuizzes && (
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="py-10 text-center text-muted-foreground">
              <BarChartHorizontalBig className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              Please select a subject and a quiz to view the leaderboard.
            </CardContent>
          </Card>
        )}
    </motion.div>
  );
};

export default AdminLeaderboardPage;

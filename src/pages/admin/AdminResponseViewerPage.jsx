import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Download, Eye, Users } from "lucide-react";
import ResponseDetailModal from "@/components/admin/ResponseDetailModal";

const AdminResponseViewerPage = () => {
  const [responses, setResponses] = useState([]);
  const [allQuestionsMap, setAllQuestionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterQuiz, setFilterQuiz] = useState("");

  const [subjectsForFilter, setSubjectsForFilter] = useState([]);
  const [quizzesForFilter, setQuizzesForFilter] = useState([]);

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { toast } = useToast();

  const fetchAllQuestions = useCallback(async () => {
    const { data, error } = await supabase.from("quizzes").select("*");
    if (error) {
      toast({
        title: "Error fetching questions map",
        description: error.message,
        variant: "destructive",
      });
      return {};
    }
    return data.reduce((acc, q) => {
      acc[q.id] = q;
      return acc;
    }, {});
  }, [toast]);

  const fetchFilterOptionsAndResponses = useCallback(async () => {
    setLoading(true);
    try {
      const { data: distinctSubjects, error: subjectError } = await supabase
        .from("quiz_responses")
        .select("subject_name")
        .distinctOn("subject_name");
      if (subjectError) throw subjectError;
      setSubjectsForFilter(
        distinctSubjects.map((s) => s.subject_name).filter(Boolean) || [],
      );

      const { data: responsesData, error: responsesError } = await supabase
        .from("quiz_responses")
        .select("*")
        .order("timestamp", { ascending: false });
      if (responsesError) throw responsesError;
      setResponses(responsesData || []);
    } catch (error) {
      toast({
        title: "Error fetching response data",
        description: error.message,
        variant: "destructive",
      });
      setResponses([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const init = async () => {
      const qMap = await fetchAllQuestions();
      setAllQuestionsMap(qMap);
      await fetchFilterOptionsAndResponses();
    };
    init();
  }, [fetchAllQuestions, fetchFilterOptionsAndResponses]);

  useEffect(() => {
    const fetchQuizzesForSubjectFilter = async () => {
      if (!filterSubject) {
        setQuizzesForFilter([]);
        setFilterQuiz("");
        return;
      }
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("quiz_title")
        .eq("subject_name", filterSubject)
        .distinctOn("quiz_title");

      if (error) {
        toast({
          title: "Error fetching quizzes for filter",
          description: error.message,
          variant: "destructive",
        });
        setQuizzesForFilter([]);
      } else {
        setQuizzesForFilter(
          data.map((q) => q.quiz_title).filter(Boolean) || [],
        );
      }
    };
    fetchQuizzesForSubjectFilter();
  }, [filterSubject, toast]);

  const filteredResponses = responses.filter((res) => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch =
      res.name && res.name.toLowerCase().includes(searchTermLower);
    const rollMatch =
      res.roll_number &&
      res.roll_number.toLowerCase().includes(searchTermLower);
    const subjectMatch = filterSubject
      ? res.subject_name === filterSubject
      : true;
    const quizMatch = filterQuiz ? res.quiz_title === filterQuiz : true;
    return (nameMatch || rollMatch) && subjectMatch && quizMatch;
  });

  const handleExportCSV = () => {
    if (filteredResponses.length === 0) {
      toast({ title: "No data to export", variant: "warning" });
      return;
    }
    const csvData = Papa.unparse(
      filteredResponses.map((r) => ({
        Name: r.name,
        RollNo: r.roll_number,
        Subject: r.subject_name,
        QuizTitle: r.quiz_title || "N/A",
        Score: r.score,
        TotalQuestions: r.total_questions,
        SubmittedAt: new Date(r.timestamp).toLocaleString(),
        ResponsesJSON: JSON.stringify(r.responses),
      })),
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `quiz_responses_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "CSV Exported",
      description: "Student responses downloaded.",
    });
  };

  const openDetailModal = (response) => {
    setSelectedResponse(response);
    setIsDetailModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-foreground">
        Student Quiz Responses
      </h1>

      <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Filters & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <Label htmlFor="searchTermRv">Search Name/Roll No</Label>
              <Input
                id="searchTermRv"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subjectFilterRv">Filter by Subject</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger id="subjectFilterRv">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjectsForFilter.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quizFilterRv">Filter by Quiz</Label>
              <Select
                value={filterQuiz}
                onValueChange={setFilterQuiz}
                disabled={!filterSubject || quizzesForFilter.length === 0}
              >
                <SelectTrigger id="quizFilterRv">
                  <SelectValue
                    placeholder={
                      !filterSubject
                        ? "Select Subject First"
                        : quizzesForFilter.length === 0
                          ? "No Quizzes"
                          : "All Quizzes"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Quizzes</SelectItem>
                  {quizzesForFilter.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="w-full md:w-auto"
              disabled={filteredResponses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredResponses.length === 0 ? (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm text-center py-10">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            No responses found matching your criteria.
          </p>
        </Card>
      ) : (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell>{res.name}</TableCell>
                    <TableCell>{res.roll_number}</TableCell>
                    <TableCell>{res.subject_name}</TableCell>
                    <TableCell>{res.quiz_title || "N/A"}</TableCell>
                    <TableCell>
                      {res.score} / {res.total_questions}
                    </TableCell>
                    <TableCell>
                      {new Date(res.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetailModal(res)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ResponseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        response={selectedResponse}
        allQuestions={allQuestionsMap}
      />
    </motion.div>
  );
};

export default AdminResponseViewerPage;

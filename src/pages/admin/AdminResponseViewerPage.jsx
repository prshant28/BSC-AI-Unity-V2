
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, RefreshCw, Loader2, User, Calendar, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminResponseViewerPage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [subjects, setSubjects] = useState([]);
  const { toast } = useToast();

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setResponses(data || []);

      // Get unique subjects for filter
      const uniqueSubjects = [...new Set(data.map(r => r.subject_name))];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quiz responses: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const filteredResponses = responses.filter((response) => {
    const matchesSearch = 
      response.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.quiz_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.subject_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "All" || response.subject_name === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
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
          <h1 className="text-3xl font-bold text-foreground">Student Responses</h1>
          <p className="text-muted-foreground">View and analyze student quiz performance</p>
        </div>
        <Button onClick={fetchResponses} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, quiz title, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResponses.length > 0 ? (
            filteredResponses.map((response, index) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                        </div>
                        <p className="text-muted-foreground mb-1">
                          <strong>Quiz:</strong> {response.quiz_title}
                        </p>
                        <p className="text-muted-foreground mb-1">
                          <strong>Subject:</strong> {response.subject_name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(response.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span className={`text-2xl font-bold ${getScoreColor(response.score, response.total_questions)}`}>
                            {response.score}/{response.total_questions}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((response.score / response.total_questions) * 100)}% Score
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center text-muted-foreground py-12 border border-dashed rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg">No quiz responses found</p>
              <p className="text-sm">Responses will appear here once students start taking quizzes</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminResponseViewerPage;

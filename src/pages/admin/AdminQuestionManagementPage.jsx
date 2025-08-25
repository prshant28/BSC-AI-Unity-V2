import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle,
  Edit3,
  Trash2,
  UploadCloud,
  Loader2,
  FileText,
} from "lucide-react";
import QuestionFormModal from "@/components/admin/QuestionFormModal";

const AdminQuestionManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("");

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const fetchSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    const { data, error } = await supabase
      .from("quizzes")
      .select("subject_name, subject_id")
      .distinctOn("subject_name");

    if (error) {
      toast({
        title: "Error fetching subjects",
        description: error.message,
        variant: "destructive",
      });
      setSubjects([]);
    } else {
      const uniqueSubjects = data
        .map((s) => ({
          name: s.subject_name,
          id: s.subject_id || s.subject_name,
        }))
        .filter((s) => s.name);
      setSubjects(uniqueSubjects || []);
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
        .from("quizzes")
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

  const fetchQuestionsForQuiz = useCallback(
    async (subjectName, quizTitle) => {
      if (!subjectName || !quizTitle) {
        setQuestions([]);
        return;
      }
      setLoadingQuestions(true);
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("subject_name", subjectName)
        .eq("quiz_title", quizTitle)
        .order("created_at", { ascending: true });
      if (error) {
        toast({
          title: "Error fetching questions",
          description: error.message,
          variant: "destructive",
        });
        setQuestions([]);
      } else {
        setQuestions(data || []);
      }
      setLoadingQuestions(false);
    },
    [toast],
  );

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      const subjectObj = subjects.find((s) => s.name === selectedSubject);
      setSelectedSubjectId(subjectObj?.id || selectedSubject);
      fetchQuizzesForSubject(selectedSubject);
      setSelectedQuizTitle("");
      setQuestions([]);
    } else {
      setSelectedSubjectId("");
      setQuizzes([]);
      setQuestions([]);
      setSelectedQuizTitle("");
    }
  }, [selectedSubject, subjects, fetchQuizzesForSubject]);

  useEffect(() => {
    if (selectedSubject && selectedQuizTitle) {
      fetchQuestionsForQuiz(selectedSubject, selectedQuizTitle);
    } else {
      setQuestions([]);
    }
  }, [selectedSubject, selectedQuizTitle, fetchQuestionsForQuiz]);

  const handleSaveQuestion = async (formData, questionId) => {
    setActionLoading(true);
    const payload = {
      ...formData,
      subject_name: selectedSubject,
      subject_id: selectedSubjectId,
      quiz_title: selectedQuizTitle,
      options: JSON.parse(formData.options),
    };

    let error;
    if (questionId) {
      ({ error } = await supabase
        .from("quizzes")
        .update(payload)
        .eq("id", questionId)
        .select());
    } else {
      ({ error } = await supabase.from("quizzes").insert([payload]).select());
    }

    if (error) {
      toast({
        title: "Error saving question",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Question ${questionId ? "Updated" : "Added"}`,
        description: "Successfully saved the question.",
      });
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      fetchQuestionsForQuiz(selectedSubject, selectedQuizTitle);
      if (!quizzes.includes(selectedQuizTitle)) {
        // If it's a new quiz title for this subject
        fetchQuizzesForSubject(selectedSubject); // Refresh quiz list for the subject
      }
      if (!subjects.find((s) => s.name === selectedSubject)) {
        // If it's a new subject
        fetchSubjects(); // Refresh subject list
      }
    }
    setActionLoading(false);
  };

  const openNewQuestionModal = () => {
    if (!selectedSubject || !selectedQuizTitle) {
      toast({
        title: "Select Subject & Quiz",
        description:
          "Please select a subject and quiz first. If the quiz doesn't exist, adding a question will create it.",
        variant: "warning",
      });
      return;
    }
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestionConfirm = async () => {
    if (!questionToDelete) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", questionToDelete.id);
    if (error) {
      toast({
        title: "Error deleting question",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Question Deleted",
        description: "Successfully deleted the question.",
      });
      fetchQuestionsForQuiz(selectedSubject, selectedQuizTitle);
    }
    setQuestionToDelete(null);
    setActionLoading(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!selectedSubject || !selectedQuizTitle) {
      toast({
        title: "Select Subject & Quiz",
        description: "Please select subject and quiz before uploading.",
        variant: "warning",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setActionLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questionsToUpload = results.data
          .map((row) => ({
            subject_id: selectedSubjectId,
            subject_name: selectedSubject,
            quiz_title: selectedQuizTitle,
            question_text: row.question_text,
            options: {
              A: row.option_a,
              B: row.option_b,
              C: row.option_c,
              D: row.option_d,
            },
            correct_option: row.correct_answer,
          }))
          .filter(
            (q) =>
              q.question_text &&
              q.options.A &&
              q.options.B &&
              q.options.C &&
              q.options.D &&
              q.correct_option,
          );

        if (questionsToUpload.length === 0) {
          toast({
            title: "No valid questions in CSV",
            description:
              "Check CSV format (requires headers: question_text, option_a, option_b, option_c, option_d, correct_answer) and content.",
            variant: "warning",
            duration: 7000,
          });
          setActionLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const { error } = await supabase
          .from("quizzes")
          .insert(questionsToUpload);
        if (error) {
          toast({
            title: "Error uploading questions",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Questions Uploaded",
            description: `${questionsToUpload.length} questions added successfully.`,
          });
          fetchQuestionsForQuiz(selectedSubject, selectedQuizTitle);
          if (!quizzes.includes(selectedQuizTitle)) {
            fetchQuizzesForSubject(selectedSubject);
          }
          if (!subjects.find((s) => s.name === selectedSubject)) {
            fetchSubjects();
          }
        }
        setActionLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: (err) => {
        toast({
          title: "CSV Parsing Error",
          description: err.message,
          variant: "destructive",
        });
        setActionLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-foreground">
        Question Management
      </h1>

      <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Filters & Actions</CardTitle>
          <CardDescription>
            Select subject and quiz to manage questions. You can also upload
            questions via CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="subjectSelectQm">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={loadingSubjects}
              >
                <SelectTrigger id="subjectSelectQm">
                  <SelectValue
                    placeholder={
                      loadingSubjects
                        ? "Loading subjects..."
                        : subjects.length > 0
                          ? "Select Subject"
                          : "No Subjects Available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length > 0 ? (
                    subjects.map((s) => (
                      <SelectItem key={s.id || s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No subjects found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quizSelectQm">Quiz</Label>
              <Select
                value={selectedQuizTitle}
                onValueChange={setSelectedQuizTitle}
                disabled={!selectedSubject || loadingQuizzes}
              >
                <SelectTrigger id="quizSelectQm">
                  <SelectValue
                    placeholder={
                      !selectedSubject
                        ? "Select Subject First"
                        : loadingQuizzes
                          ? "Loading quizzes..."
                          : quizzes.length > 0
                            ? "Select Quiz"
                            : "No Quizzes Available"
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
                      No quizzes for this subject
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <Button
                onClick={openNewQuestionModal}
                disabled={
                  !selectedSubject || !selectedQuizTitle || actionLoading
                }
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={
                  !selectedSubject || !selectedQuizTitle || actionLoading
                }
                className="w-full sm:w-auto"
              >
                {actionLoading && fileInputRef.current?.files?.length > 0 ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Upload CSV
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loadingQuestions && selectedSubject && selectedQuizTitle ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : !selectedSubject || !selectedQuizTitle ? (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Please select a subject and quiz to view questions.
          </p>
        </Card>
      ) : questions.length === 0 ? (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            No questions found for "{selectedQuizTitle}" in "{selectedSubject}".
          </p>
          <p className="text-sm text-muted-foreground/80">
            Try adding some manually or uploading a CSV.
          </p>
        </Card>
      ) : (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Questions for {selectedQuizTitle} ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">
                      Question Text
                    </TableHead>
                    <TableHead className="min-w-[200px]">Options</TableHead>
                    <TableHead>Correct</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={q.question_text}>
                          {q.question_text}
                        </div>
                      </TableCell>
                      <TableCell>
                        <pre
                          className="text-xs max-w-xs truncate bg-muted p-1 rounded"
                          title={JSON.stringify(q.options, null, 2)}
                        >
                          {JSON.stringify(q.options)}
                        </pre>
                      </TableCell>
                      <TableCell>{q.correct_option}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditQuestionModal(q)}
                        >
                          <Edit3 className="h-4 w-4 text-blue-500" />
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuestionToDelete(q)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        editingQuestion={editingQuestion}
        subjectName={selectedSubject}
        quizTitle={selectedQuizTitle}
        onSave={handleSaveQuestion}
        loading={actionLoading}
      />

      <AlertDialog
        open={!!questionToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setQuestionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the question: "
              <strong>
                {questionToDelete?.question_text.substring(0, 50)}...
              </strong>
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestionConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminQuestionManagementPage;

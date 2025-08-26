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
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

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

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Subject name required",
        description: "Please enter a valid subject name.",
        variant: "warning",
      });
      return;
    }

    setActionLoading(true);
    try {
      // Create a dummy quiz entry to establish the subject
      const { error } = await supabase.from("quizzes").insert([{
        subject_name: newSubjectName.trim(),
        subject_id: newSubjectName.trim().toLowerCase().replace(/\s+/g, '_'),
        quiz_title: "Default Quiz",
        question_text: "This is a placeholder question that will be replaced.",
        options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
        correct_option: "A"
      }]);

      if (error) throw error;

      toast({
        title: "Subject Created",
        description: `Subject "${newSubjectName}" has been created successfully.`,
      });

      setNewSubjectName("");
      setShowCreateSubject(false);
      fetchSubjects();
    } catch (error) {
      toast({
        title: "Error creating subject",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle.trim()) {
      toast({
        title: "Quiz title required",
        description: "Please enter a valid quiz title.",
        variant: "warning",
      });
      return;
    }

    if (!selectedSubject) {
      toast({
        title: "Select subject first",
        description: "Please select a subject before creating a quiz.",
        variant: "warning",
      });
      return;
    }

    setActionLoading(true);
    try {
      // Create a dummy question to establish the quiz
      const { error } = await supabase.from("quizzes").insert([{
        subject_name: selectedSubject,
        subject_id: selectedSubjectId,
        quiz_title: newQuizTitle.trim(),
        question_text: "This is a placeholder question that will be replaced.",
        options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
        correct_option: "A"
      }]);

      if (error) throw error;

      toast({
        title: "Quiz Created",
        description: `Quiz "${newQuizTitle}" has been created successfully.`,
      });

      setNewQuizTitle("");
      setShowCreateQuiz(false);
      setSelectedQuizTitle(newQuizTitle.trim());
      fetchQuizzesForSubject(selectedSubject);
    } catch (error) {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openNewQuestionModal = () => {
    if (!selectedSubject || !selectedQuizTitle) {
      toast({
        title: "Select Subject & Quiz",
        description:
          "Please select a subject and quiz first, or create new ones using the buttons below.",
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

  const handleDeleteAllQuestions = async () => {
    if (!selectedSubject || !selectedQuizTitle) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("subject_name", selectedSubject)
        .eq("quiz_title", selectedQuizTitle);

      if (error) throw error;

      toast({
        title: "All Questions Deleted",
        description: `All questions in "${selectedQuizTitle}" have been deleted.`,
      });

      setQuestions([]);
      fetchQuizzesForSubject(selectedSubject);
    } catch (error) {
      toast({
        title: "Error deleting questions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
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
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="subjectSelectQm">Subject</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateSubject(!showCreateSubject)}
                  className="text-xs"
                >
                  <PlusCircle className="mr-1 h-3 w-3" />
                  New Subject
                </Button>
              </div>
              {showCreateSubject ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Subject name..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleCreateSubject}
                    disabled={actionLoading || !newSubjectName.trim()}
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateSubject(false);
                      setNewSubjectName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
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
                      <SelectItem value="no_subjects" disabled>
                        No subjects found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="quizSelectQm">Quiz</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateQuiz(!showCreateQuiz)}
                  disabled={!selectedSubject}
                  className="text-xs"
                >
                  <PlusCircle className="mr-1 h-3 w-3" />
                  New Quiz
                </Button>
              </div>
              {showCreateQuiz ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Quiz title..."
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleCreateQuiz}
                    disabled={actionLoading || !newQuizTitle.trim() || !selectedSubject}
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateQuiz(false);
                      setNewQuizTitle("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
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
                      <SelectItem value="no_quizzes" disabled>
                        No quizzes for this subject
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
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
          {questions.length > 0 && (
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Questions
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all questions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {questions.length} questions in "{selectedQuizTitle}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllQuestions}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Delete All Questions"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuestionToDelete(q)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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
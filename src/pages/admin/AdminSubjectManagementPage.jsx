import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, BookOpen } from "lucide-react";
import QuizModal from "@/components/admin/QuizModal";
import DeleteQuizDialog from "@/components/admin/DeleteQuizDialog";
import SubjectCardItem from "@/components/admin/SubjectCardItem";

const AdminSubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [quizzesBySubject, setQuizzesBySubject] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentSubjectForModal, setCurrentSubjectForModal] = useState(null);
  const [editingQuizDetails, setEditingQuizDetails] = useState(null);

  const [quizToDeleteDetails, setQuizToDeleteDetails] = useState(null);
  const [isDeleteDialogValid, setIsDeleteDialogValid] = useState(false);

  const fetchSubjectsAndQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const { data: quizData, error } = await supabase
        .from("quizzes")
        .select("subject_id, subject_name, quiz_title, id")
        .order("subject_name", { ascending: true })
        .order("quiz_title", { ascending: true });

      if (error) throw error;

      const subjectMap = new Map();
      const quizzesGrouped = {};

      quizData.forEach((q) => {
        if (q.subject_name && !subjectMap.has(q.subject_name)) {
          subjectMap.set(q.subject_name, {
            id: q.subject_id || q.subject_name,
            name: q.subject_name,
            quizCount: 0,
          });
        }

        if (q.subject_name && !quizzesGrouped[q.subject_name]) {
          quizzesGrouped[q.subject_name] = [];
        }

        if (
          q.subject_name &&
          q.quiz_title &&
          !quizzesGrouped[q.subject_name].find(
            (qz) => qz.title === q.quiz_title,
          )
        ) {
          quizzesGrouped[q.subject_name].push({
            title: q.quiz_title,
            questionCount: 0,
          });
        }
      });

      quizData.forEach((q) => {
        if (q.subject_name && q.quiz_title && subjectMap.has(q.subject_name)) {
          const quizEntry = quizzesGrouped[q.subject_name]?.find(
            (qz) => qz.title === q.quiz_title,
          );
          if (quizEntry) {
            quizEntry.questionCount = (quizEntry.questionCount || 0) + 1;
          }
        }
      });

      Object.entries(quizzesGrouped).forEach(
        ([subjectName, subjectQuizzes]) => {
          if (subjectMap.has(subjectName)) {
            subjectMap.get(subjectName).quizCount = subjectQuizzes.length;
          }
        },
      );

      setSubjects(Array.from(subjectMap.values()));
      setQuizzesBySubject(quizzesGrouped);
    } catch (fetchError) {
      console.error("Error fetching subjects and quizzes:", fetchError);
      toast({
        title: "Error",
        description:
          "Could not load subjects or quizzes. " + fetchError.message,
        variant: "destructive",
      });
      setSubjects([]);
      setQuizzesBySubject({});
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubjectsAndQuizzes();
  }, [fetchSubjectsAndQuizzes]);

  const openNewQuizModal = (subject) => {
    setCurrentSubjectForModal(subject);
    setEditingQuizDetails(null);
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (subject, quiz) => {
    setCurrentSubjectForModal(subject);
    setEditingQuizDetails({
      subjectName: subject.name,
      oldTitle: quiz.title,
      title: quiz.title,
    });
    setIsQuizModalOpen(true);
  };

  const openDeleteQuizDialog = (subject, quiz) => {
    setQuizToDeleteDetails({
      subjectName: subject.name,
      quizTitle: quiz.title,
    });
    setIsDeleteDialogValid(true);
  };

  const handleSaveQuiz = async (subject, oldTitle, newTitle) => {
    setActionLoading(true);
    try {
      if (oldTitle) {
        const { error: updateError } = await supabase
          .from("quizzes")
          .update({ quiz_title: newTitle })
          .match({ subject_name: subject.name, quiz_title: oldTitle });
        if (updateError) throw updateError;

        const { error: updateResponsesError } = await supabase
          .from("quiz_responses")
          .update({ quiz_title: newTitle })
          .match({ subject_name: subject.name, quiz_title: oldTitle });
        if (updateResponsesError)
          console.warn(
            "Could not update quiz_title in quiz_responses:",
            updateResponsesError.message,
          );

        toast({
          title: "Quiz Title Updated",
          description: `Quiz "${oldTitle}" renamed to "${newTitle}".`,
        });
      } else {
        toast({
          title: "Quiz Placeholder Ready",
          description: `You can now add questions to "${newTitle}" under ${subject.name}. A quiz is formally created when its first question is added.`,
        });
      }
      fetchSubjectsAndQuizzes();
    } catch (saveError) {
      console.error("Error saving quiz:", saveError);
      toast({
        title: "Error",
        description: "Could not save quiz information. " + saveError.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setIsQuizModalOpen(false);
      setEditingQuizDetails(null);
      setCurrentSubjectForModal(null);
    }
  };

  const handleDeleteQuizConfirm = async () => {
    if (!quizToDeleteDetails) return;
    setActionLoading(true);
    try {
      const { error: questionsError } = await supabase
        .from("quizzes")
        .delete()
        .match({
          subject_name: quizToDeleteDetails.subjectName,
          quiz_title: quizToDeleteDetails.quizTitle,
        });
      if (questionsError) throw questionsError;

      const { error: responsesError } = await supabase
        .from("quiz_responses")
        .delete()
        .match({
          subject_name: quizToDeleteDetails.subjectName,
          quiz_title: quizToDeleteDetails.quizTitle,
        });
      if (responsesError)
        console.warn(
          "Could not delete responses for quiz:",
          responsesError.message,
        );

      toast({
        title: "Quiz Deleted",
        description: `Quiz "${quizToDeleteDetails.quizTitle}" and its associated data deleted.`,
      });
      fetchSubjectsAndQuizzes();
    } catch (deleteError) {
      console.error("Error deleting quiz:", deleteError);
      toast({
        title: "Error",
        description: "Could not delete quiz. " + deleteError.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setQuizToDeleteDetails(null);
      setIsDeleteDialogValid(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">
          Subject & Quiz Management
        </h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p>
            {subjects.length === 0
              ? "No subjects available yet."
              : "No subjects found matching your search."}
          </p>
          <p className="text-sm">
            You can add questions to create new subjects and quizzes in the
            "Question Management" section.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSubjects.map((subject) => (
            <SubjectCardItem
              key={subject.id || subject.name}
              subject={subject}
              quizzes={quizzesBySubject[subject.name] || []}
              onNewQuiz={openNewQuizModal}
              onEditQuiz={openEditQuizModal}
              onDeleteQuiz={openDeleteQuizDialog}
            />
          ))}
        </div>
      )}

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setCurrentSubjectForModal(null);
          setEditingQuizDetails(null);
        }}
        subject={currentSubjectForModal}
        quiz={editingQuizDetails}
        onSave={handleSaveQuiz}
        loading={actionLoading}
      />

      <DeleteQuizDialog
        isOpen={isDeleteDialogValid}
        onClose={() => {
          setQuizToDeleteDetails(null);
          setIsDeleteDialogValid(false);
        }}
        quizToDelete={quizToDeleteDetails}
        onDelete={handleDeleteQuizConfirm}
        loading={actionLoading}
      />
    </motion.div>
  );
};

export default AdminSubjectManagementPage;

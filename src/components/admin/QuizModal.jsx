import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QuizModal = ({ isOpen, onClose, subject, quiz, onSave, loading }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || "");
    } else {
      setTitle("");
    }
  }, [quiz, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      // Consider adding a toast here for user feedback
      return;
    }
    onSave(subject, quiz ? quiz.oldTitle : null, title);
  };

  if (!subject) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {quiz ? "Edit Quiz Title" : "Create New Quiz"} for {subject.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {quiz
              ? `Enter the new title for the quiz "${quiz.oldTitle}".`
              : `Enter a title for the new quiz. You can add questions to it later.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="quizTitleModal" className="text-sm font-medium">
            Quiz Title
          </Label>
          <Input
            id="quizTitleModal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Midterm Exam"
            className="mt-1"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : quiz ? (
              "Save Changes"
            ) : (
              "Create Quiz"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuizModal;

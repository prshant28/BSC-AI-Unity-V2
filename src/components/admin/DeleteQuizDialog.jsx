import React from "react";
import { Button } from "@/components/ui/button";
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

const DeleteQuizDialog = ({
  isOpen,
  onClose,
  quizToDelete,
  onDelete,
  loading,
}) => {
  if (!quizToDelete) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this quiz?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the quiz "
            <strong>{quizToDelete.quizTitle}</strong>" under "
            <strong>{quizToDelete.subjectName}</strong>" and all its associated
            questions. This action cannot be undone. Student responses for these
            questions might also be affected or orphaned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Yes, Delete Quiz"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuizDialog;

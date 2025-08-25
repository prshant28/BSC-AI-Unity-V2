import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const defaultFormData = {
  question_text: "",
  options: '{"A": "", "B": "", "C": "", "D": ""}',
  correct_option: "A",
};

const QuestionFormModal = ({
  isOpen,
  onClose,
  editingQuestion,
  subjectName,
  quizTitle,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const { toast } = useToast();

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question_text: editingQuestion.question_text || "",
        options: editingQuestion.options
          ? JSON.stringify(editingQuestion.options, null, 2)
          : defaultFormData.options,
        correct_option: editingQuestion.correct_option || "A",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingQuestion, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.question_text.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    try {
      JSON.parse(formData.options);
    } catch (e) {
      toast({
        title: "Validation Error",
        description: "Options must be valid JSON.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.correct_option.trim()) {
      toast({
        title: "Validation Error",
        description: "Correct option cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    onSave(formData, editingQuestion ? editingQuestion.id : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription>
            For quiz "{quizTitle}" in subject "{subjectName}". Ensure options
            are valid JSON.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="question_text_modal">Question Text</Label>
            <Textarea
              id="question_text_modal"
              name="question_text"
              value={formData.question_text}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="options_modal">Options (JSON format)</Label>
            <Textarea
              id="options_modal"
              name="options"
              value={formData.options}
              onChange={handleChange}
              rows={5}
              className="mt-1 font-mono text-sm"
              placeholder='{"A": "Option A Text", "B": "Option B Text", ...}'
            />
          </div>
          <div>
            <Label htmlFor="correct_option_modal">
              Correct Option Key (e.g., A, B, C, D)
            </Label>
            <Input
              id="correct_option_modal"
              name="correct_option"
              value={formData.correct_option}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Question"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormModal;

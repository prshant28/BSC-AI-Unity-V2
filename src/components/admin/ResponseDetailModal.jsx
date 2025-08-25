import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";

const ResponseDetailModal = ({ isOpen, onClose, response, allQuestions }) => {
  if (!response) return null;

  const getQuestionText = (questionId) =>
    allQuestions[questionId]?.question_text || "Question not found";
  const getCorrectOptionText = (questionId) => {
    const q = allQuestions[questionId];
    return q ? q.options[q.correct_option] || "N/A" : "N/A";
  };
  const getSelectedOptionText = (questionId, selectedKey) => {
    const q = allQuestions[questionId];
    return q && q.options[selectedKey]
      ? q.options[selectedKey]
      : "Not Answered / Invalid";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Response Details: {response.name} ({response.roll_number})
          </DialogTitle>
          <DialogDescription>
            Subject: {response.subject_name} | Quiz:{" "}
            {response.quiz_title || "N/A"} | Score: {response.score}/
            {response.total_questions}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {Object.entries(response.responses).map(
            ([questionId, selectedOptionKey], index) => {
              const question = allQuestions[questionId];
              const isCorrect =
                question && question.correct_option === selectedOptionKey;
              return (
                <Card
                  key={questionId}
                  className={isCorrect ? "border-green-500" : "border-red-500"}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex justify-between items-center">
                      <span>
                        Question {index + 1}: {getQuestionText(questionId)}
                      </span>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1">
                    <p>
                      Your Answer:{" "}
                      <span
                        className={
                          isCorrect
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {getSelectedOptionText(questionId, selectedOptionKey)} (
                        {selectedOptionKey})
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        Correct Answer:{" "}
                        <span className="text-green-600">
                          {getCorrectOptionText(questionId)} (
                          {question?.correct_option})
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseDetailModal;

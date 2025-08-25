import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import QuizStartForm from "@/components/QuizStartForm";

const QuizInterfacePage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", rollNumber: "" });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [currentQuizTitle, setCurrentQuizTitle] = useState("");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("subject_id", subjectId); // Assuming subjectId matches the 'subject_id' column

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setQuestions(data);
        setCurrentQuizTitle(data[0].quiz_title || "General Quiz");
      } else {
        setQuestions([]);
        setError("No questions found for this subject or quiz.");
      }
    } catch (e) {
      console.error("Error fetching questions:", e);
      setError("Failed to load questions. Please try again.");
      toast({
        title: "Loading Error",
        description: e.message || "Could not fetch quiz questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [subjectId, toast]);

  useEffect(() => {
    if (quizStarted) {
      fetchQuestions();
    }
  }, [quizStarted, fetchQuestions]);

  const handleAnswerSelect = (questionId, answerKey) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerKey }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        score++;
      }
    });

    setFinalScore(score);

    const responseData = {
      name: userInfo.name,
      roll_number: userInfo.rollNumber,
      subject_id: subjectId,
      subject_name:
        questions.length > 0 ? questions[0].subject_name : "Unknown Subject",
      quiz_title: currentQuizTitle, // Save the quiz_title
      responses: selectedAnswers,
      score: score,
      total_questions: questions.length,
      timestamp: new Date().toISOString(),
    };

    try {
      const { error: submitError } = await supabase
        .from("quiz_responses")
        .insert([responseData]);
      if (submitError) throw submitError;

      setQuizSubmitted(true);
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-semibold">Quiz Submitted!</span>
          </div>
        ),
        description: `Thank you, ${userInfo.name}! Your score is ${score}/${questions.length}.`,
      });
    } catch (e) {
      console.error("Error submitting quiz:", e);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Submission Error</span>
          </div>
        ),
        description:
          e.message || "Failed to submit your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (name, rollNumber) => {
    setUserInfo({ name, rollNumber });
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <QuizStartForm
          onSubmit={handleStartQuiz}
          subjectNameFromUrl={subjectId}
        />
      </div>
    );
  }

  if (loading && !quizSubmitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl font-semibold text-foreground">
          Loading Quiz...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6">
        <AlertTriangle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-center mb-6">{error}</p>
        <Button
          onClick={() => navigate("/semester-1-quizzes")}
          variant="destructive"
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (questions.length === 0 && !loading && quizStarted && !quizSubmitted) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 p-6">
        <AlertTriangle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Questions Available</h2>
        <p className="text-center mb-6">
          It seems there are no questions for this quiz yet. Please check back
          later.
        </p>
        <Button
          onClick={() => navigate("/semester-1-quizzes")}
          variant="outline"
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 text-center"
      >
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Quiz Submitted Successfully!
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          Thank you,{" "}
          <span className="font-semibold text-primary">{userInfo.name}</span>!
        </p>
        <p className="text-3xl font-semibold text-foreground mb-8">
          Your Score:{" "}
          <span className="text-green-600 dark:text-green-400">
            {finalScore}
          </span>{" "}
          / {questions.length}
        </p>
        <Button
          onClick={() => navigate("/semester-1-quizzes")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Back to Quizzes <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null; // Should not happen if questions array is populated

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4 sm:p-6"
    >
      <Card className="w-full max-w-2xl shadow-2xl bg-card/90 backdrop-blur-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl sm:text-3xl text-center text-primary">
            {currentQuestion.subject_name} - {currentQuizTitle}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="py-6 sm:py-8">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg sm:text-xl font-semibold mb-6 text-foreground">
              {currentQuestion.question_text}
            </p>
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={(value) =>
                handleAnswerSelect(currentQuestion.id, value)
              }
              className="space-y-3"
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay:
                      Object.keys(currentQuestion.options).indexOf(key) * 0.05,
                  }}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem
                    value={key}
                    id={`${currentQuestion.id}-${key}`}
                  />
                  <Label
                    htmlFor={`${currentQuestion.id}-${key}`}
                    className="text-base text-foreground cursor-pointer flex-1"
                  >
                    {value}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0 || loading}
            variant="outline"
          >
            Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={
                loading ||
                Object.keys(selectedAnswers).length !== questions.length
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit Quiz"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizInterfacePage;

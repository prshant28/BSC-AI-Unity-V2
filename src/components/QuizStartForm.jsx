import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { User, Hash, PlayCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const QuizStartForm = ({ onSubmit, subjectNameFromUrl }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your name and roll number.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(name, rollNumber);
  };

  // Attempt to format subjectNameFromUrl nicely (e.g., 'ATA' -> 'Algorithmic Thinking and its Applications')
  // This is a simple heuristic; a more robust mapping might be needed if IDs are complex
  let displaySubjectName = subjectNameFromUrl;
  if (subjectNameFromUrl) {
    if (subjectNameFromUrl === "ATA")
      displaySubjectName = "Algorithmic Thinking and its Applications";
    else if (subjectNameFromUrl === "BDA")
      displaySubjectName = "Basics Of Data Analytics";
    else if (subjectNameFromUrl === "FSP")
      displaySubjectName = "Foundations Of Statistics and Probability";
    else if (subjectNameFromUrl === "LANA")
      displaySubjectName = "Linear Algebra and Numerical Analysis";
    else
      displaySubjectName = subjectNameFromUrl.replace(/([A-Z])/g, " $1").trim(); // Add spaces before capitals
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">Start Quiz</CardTitle>
          {displaySubjectName && (
            <CardDescription>
              You are about to start the quiz for{" "}
              <span className="font-semibold text-primary">
                {displaySubjectName}
              </span>
              .
            </CardDescription>
          )}
          <CardDescription>Please enter your details to begin.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" /> Full
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="E.g., Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="flex items-center text-sm">
                <Hash className="mr-2 h-4 w-4 text-muted-foreground" /> Roll
                Number
              </Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="E.g., BSC001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            >
              <PlayCircle className="mr-2 h-5 w-5" /> Start Quiz
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default QuizStartForm;

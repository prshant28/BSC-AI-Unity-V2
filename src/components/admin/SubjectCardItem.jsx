import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SubjectCardItem = ({
  subject,
  quizzes,
  onNewQuiz,
  onEditQuiz,
  onDeleteQuiz,
}) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{subject.name}</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNewQuiz(subject)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Quiz
          </Button>
        </div>
        <CardDescription>
          {subject.quizCount} {subject.quizCount === 1 ? "quiz" : "quizzes"}{" "}
          available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {quizzes && quizzes.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.title}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.questionCount}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditQuiz(subject, quiz)}
                      >
                        <Edit3 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteQuiz(subject, quiz)}
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
        ) : (
          <p className="text-sm text-muted-foreground">
            No quizzes created for this subject yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectCardItem;

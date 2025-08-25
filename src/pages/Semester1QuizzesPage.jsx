import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SEMESTER_1_SUBJECTS } from "@/lib/constants";
import {
  ArrowRight,
  Cpu,
  BarChart3,
  Sigma,
  SquareEqual as SquareRoot,
  BookOpen,
} from "lucide-react";

const iconMap = {
  Cpu: Cpu,
  BarChart3: BarChart3,
  Sigma: Sigma,
  SquareRoot: SquareRoot,
  BookOpen: BookOpen,
};

const Semester1QuizzesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto py-12 px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-3">
          Semester 1 Quizzes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge in the foundational subjects of your first
          semester. Select a subject to begin.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
        variants={containerVariants}
      >
        {SEMESTER_1_SUBJECTS.map((subject, index) => {
          const IconComponent = iconMap[subject.icon] || BookOpen;
          return (
            <motion.div key={subject.id} variants={itemVariants}>
              <Link to={`/semester-1-quizzes/${subject.id}/take`}>
                <Card
                  className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group ${subject.color} text-white overflow-hidden`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">
                        {subject.name}
                      </CardTitle>
                      <IconComponent className="h-10 w-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-indigo-100 mb-4">
                      Ready to challenge yourself in {subject.name}? Click here
                      to start the quiz.
                    </CardDescription>
                    <div className="flex justify-end items-center text-sm font-medium text-indigo-200 group-hover:text-white transition-colors">
                      Start Quiz{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
      <motion.p
        variants={itemVariants}
        className="text-center text-muted-foreground mt-12 text-sm"
      >
        More subjects and quizzes will be added soon. Keep learning!
      </motion.p>
    </motion.div>
  );
};

export default Semester1QuizzesPage;

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Code, Zap, Linkedin, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentAchievementsPage = () => {
  const achievements = [
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      category: "Certifications",
      title: "Advanced Cloud Practitioner",
      student: "Aarav Sharma",
      description: "Completed AWS Certified Cloud Practitioner, demonstrating foundational cloud knowledge.",
      platform: "AWS",
      date: "April 2025",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      category: "Internships",
      title: "Data Science Intern at TechNova",
      student: "Priya Singh",
      description: "Secured a competitive internship focusing on predictive modeling and data visualization.",
      platform: "TechNova Solutions",
      date: "May 2025 - Ongoing",
    },
    {
      icon: <Code className="h-8 w-8 text-green-500" />,
      category: "Hackathons",
      title: "Winner - AI For Good Hackathon",
      student: "Rohan Das & Team",
      description: "Developed an AI-powered solution for early detection of agricultural diseases.",
      platform: "InnovateIndia Org",
      date: "March 2025",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      category: "Startups/Projects",
      title: "Founder - EdTech Platform 'LearnAI'",
      student: "Meera Reddy",
      description: "Launched a platform offering personalized AI-driven learning paths for K-12 students.",
      platform: "LearnAI (Self-founded)",
      date: "February 2025",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-extrabold text-center mb-6 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Student Achievements
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Celebrating the successes and milestones of our talented students from the B.Sc. (Applied AI & Data Science) 2024 batch. This is a static showcase for now.
      </motion.p>

      {achievements.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {achievements.map((ach, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-card/70 backdrop-blur-sm border-border hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                       {ach.icon}
                       <CardTitle className="text-xl text-foreground">{ach.title}</CardTitle>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{ach.category}</span>
                  </div>
                  <CardDescription className="pt-1">By: {ach.student} | {ach.platform} | {ach.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
         <motion.p 
          className="text-center text-muted-foreground text-xl py-12 border border-dashed border-border rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          No achievements listed yet. Stay tuned as our students pioneer and excel!
        </motion.p>
      )}

      <motion.div 
        className="text-center mt-16 p-8 bg-gradient-to-r from-indigo-500/10 via-primary/10 to-secondary/10 dark:from-indigo-500/5 dark:via-primary/5 dark:to-secondary/5 rounded-xl shadow-inner border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: achievements.length > 0 ? 0.5 : 0.3 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Share Your Success!</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Have an achievement to share? We're working on a system for submissions. In the future, you might connect your LinkedIn or GitHub profiles too!
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" disabled>
                <Linkedin className="mr-2 h-5 w-5"/> Connect LinkedIn (Soon)
            </Button>
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10" disabled>
                <Github className="mr-2 h-5 w-5"/> Connect GitHub (Soon)
            </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentAchievementsPage;
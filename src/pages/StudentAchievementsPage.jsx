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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Star, 
  Trophy, 
  Medal, 
  Target, 
  BookOpen, 
  MessageSquare,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

const StudentAchievementsPage = () => {
  const [userProgress, setUserProgress] = useState({
    totalPoints: 450,
    level: 3,
    nextLevelPoints: 500,
    completedQuizzes: 12,
    submittedConcerns: 3,
    helpfulVotes: 15,
    daysActive: 28
  });

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first quiz",
      icon: <Target className="h-6 w-6" />,
      earned: true,
      points: 50,
      category: "Quiz"
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Complete 10 quizzes",
      icon: <BookOpen className="h-6 w-6" />,
      earned: true,
      points: 100,
      category: "Quiz"
    },
    {
      id: 3,
      title: "Voice of Change",
      description: "Submit your first concern",
      icon: <MessageSquare className="h-6 w-6" />,
      earned: true,
      points: 75,
      category: "Community"
    },
    {
      id: 4,
      title: "Helpful Peer",
      description: "Receive 10 helpful votes",
      icon: <Star className="h-6 w-6" />,
      earned: true,
      points: 125,
      category: "Community"
    },
    {
      id: 5,
      title: "Dedicated Learner",
      description: "Active for 30 consecutive days",
      icon: <Calendar className="h-6 w-6" />,
      earned: false,
      points: 200,
      category: "Engagement",
      progress: 93 // 28/30 days
    },
    {
      id: 6,
      title: "Knowledge Seeker",
      description: "Complete 25 quizzes",
      icon: <Trophy className="h-6 w-6" />,
      earned: false,
      points: 250,
      category: "Quiz",
      progress: 48 // 12/25 quizzes
    },
    {
      id: 7,
      title: "Community Leader",
      description: "Receive 50 helpful votes",
      icon: <Medal className="h-6 w-6" />,
      earned: false,
      points: 300,
      category: "Community",
      progress: 30 // 15/50 votes
    },
    {
      id: 8,
      title: "AI Expert",
      description: "Complete all AI-related quizzes",
      icon: <Zap className="h-6 w-6" />,
      earned: false,
      points: 400,
      category: "Specialty",
      progress: 0
    }
  ];

  const levelProgress = (userProgress.totalPoints / userProgress.nextLevelPoints) * 100;

  const categoryStats = {
    Quiz: achievements.filter(a => a.category === "Quiz" && a.earned).length,
    Community: achievements.filter(a => a.category === "Community" && a.earned).length,
    Engagement: achievements.filter(a => a.category === "Engagement" && a.earned).length,
    Specialty: achievements.filter(a => a.category === "Specialty" && a.earned).length
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
          Student Achievements
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your progress and earn badges as you engage with the BScAI Unity platform
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Award className="h-6 w-6" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProgress.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Level {userProgress.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.earned).length}</div>
                <div className="text-sm text-muted-foreground">Achievements Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userProgress.daysActive}</div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress to Level {userProgress.level + 1}</span>
                <span className="text-sm text-muted-foreground">
                  {userProgress.totalPoints} / {userProgress.nextLevelPoints} points
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {Object.entries(categoryStats).map(([category, count]) => (
          <Card key={category} className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold">{count}</div>
              <div className="text-sm text-muted-foreground">{category}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`h-full transition-all duration-300 ${
              achievement.earned 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-full ${
                    achievement.earned ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <Badge variant={achievement.earned ? "default" : "secondary"}>
                    {achievement.points} pts
                  </Badge>
                </div>
                <CardTitle className={`text-lg ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${achievement.earned ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                
                {!achievement.earned && achievement.progress !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
                
                <Badge 
                  variant="outline" 
                  className={`mt-2 ${
                    achievement.category === 'Quiz' ? 'border-blue-300 text-blue-700' :
                    achievement.category === 'Community' ? 'border-green-300 text-green-700' :
                    achievement.category === 'Engagement' ? 'border-purple-300 text-purple-700' :
                    'border-orange-300 text-orange-700'
                  }`}
                >
                  {achievement.category}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-800">Keep Going!</h3>
            <p className="text-blue-700">
              Complete more quizzes, engage with the community, and submit valuable concerns to earn more achievements and level up!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StudentAchievementsPage;


import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Brain,
  Users,
  BarChart3,
  BookOpen,
  Award,
  HelpCircle,
  Mail,
  FileText,
  Calendar,
  Globe,
  Shield
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Chatbot",
      description: "Get instant responses to your academic queries with our intelligent chatbot that understands course-specific questions.",
      action: "Try Chatbot",
      link: "/"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Concern Management",
      description: "Submit and track your academic, technical, or administrative concerns with guaranteed admin responses.",
      action: "Submit Concern",
      link: "/add-concern"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with subject-specific quizzes designed for the Applied AI & Data Science curriculum.",
      action: "Take Quiz",
      link: "/semester-1-quizzes"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Progress Tracking",
      description: "Monitor your academic progress, quiz scores, and engagement with detailed analytics and insights.",
      action: "View Stats",
      link: "/status-board"
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-600" />,
      title: "Student Community",
      description: "Connect with fellow students nationwide, share experiences, and collaborate on projects.",
      action: "Join Community",
      link: "/about"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Course Resources",
      description: "Access comprehensive information about the B.Sc. Applied AI & Data Science program structure.",
      action: "Explore Course",
      link: "/about-course"
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Achievement System",
      description: "Earn badges and recognition for active participation, quiz completion, and community engagement.",
      action: "View Achievements",
      link: "/student-achievements"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Student Rights",
      description: "Learn about your rights as a student and understand the proper channels for addressing concerns.",
      action: "Know Your Rights",
      link: "/know-your-rights"
    },
    {
      icon: <Mail className="h-8 w-8 text-pink-600" />,
      title: "Email Integration",
      description: "Receive important updates, concern responses, and notifications directly to your email.",
      action: "Contact Us",
      link: "/contact"
    },
    {
      icon: <Calendar className="h-8 w-8 text-emerald-600" />,
      title: "Event Calendar",
      description: "Stay updated with important academic dates, deadlines, and community events.",
      action: "Coming Soon",
      link: "#"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Multi-Language Support",
      description: "Access the platform in multiple languages to ensure accessibility for all students.",
      action: "Coming Soon",
      link: "#"
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-gray-600" />,
      title: "24/7 Support",
      description: "Get help anytime with our comprehensive FAQ section and responsive admin team.",
      action: "Get Help",
      link: "/contact"
    }
  ];

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
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
          Platform Features
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover all the powerful features designed to enhance your B.Sc. Applied AI & Data Science learning experience
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button 
                  asChild 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={feature.link === "#"}
                >
                  <Link to={feature.link}>
                    {feature.action}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Need Help or Have Suggestions?
            </h2>
            <p className="text-blue-700 mb-6">
              Our platform is constantly evolving based on student feedback. If you have ideas for new features
              or need assistance with existing ones, don't hesitate to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/add-concern">
                  Submit Feature Request
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link to="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FeaturesPage;

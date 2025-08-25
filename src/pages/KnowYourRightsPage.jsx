import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, BookUser, MessageSquare as MessageSquareHeart, Info, AlertOctagon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KnowYourRightsPage = () => {
  const rightsInfo = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Right to Fair Assessment & Feedback",
      description: "Students have the right to fair, transparent, and timely evaluation methods. This includes clear grading rubrics, constructive feedback on assessments, and a defined process for addressing assessment-related concerns."
    },
    {
      icon: <Scale className="h-8 w-8 text-primary" />,
      title: "Right to Quality Education & Resources",
      description: "Students are entitled to access quality learning materials, competent instruction, and a supportive academic environment. This includes necessary technical resources, stable learning platforms, and access to library or digital resources as promised."
    },
    {
      icon: <BookUser className="h-8 w-8 text-primary" />,
      title: "Right to Information & Transparency",
      description: "Students should receive clear, accurate, and timely information regarding course structure, academic policies, schedules, fee structures, and any changes affecting their academic progress. Information about grievance redressal mechanisms must also be accessible."
    },
    {
      icon: <MessageSquareHeart className="h-8 w-8 text-primary" />,
      title: "Right to Voice Concerns Respectfully",
      description: "Students have the right to express their academic, technical, or administrative concerns respectfully and through appropriate channels without fear of reprisal. BScAI Unity aims to be a primary, constructive platform for this."
    }
  ];

  const programContext = "The B.Sc./BS in Applied AI and Data Science at IIT Jodhpur, in collaboration with Futurense Uni, is a unique online program. While it offers flexibility and an IIT degree, being aware of general student rights within such a framework is crucial for a positive learning experience.";

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
        Know Your Rights
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        As students of the B.Sc. (Applied AI & Data Science) program, it's important to be aware of your general rights within an academic setting. This page provides a basic outline to empower you. (Note: This is for general awareness and not legal advice. Always refer to official IIT Jodhpur documentation for definitive policies.)
      </motion.p>
      
      <motion.div 
        className="max-w-3xl mx-auto mb-12 p-6 bg-primary/5 border border-primary/20 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <p className="text-md text-foreground text-center leading-relaxed">
          <Info className="inline-block h-6 w-6 mr-2 text-primary" />
          {programContext}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {rightsInfo.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-card/70 backdrop-blur-sm border-border hover:border-primary/30">
              <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                {item.icon}
                <div className="flex-1">
                  <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="text-center mt-12 p-8 bg-gradient-to-r from-indigo-500/10 via-primary/10 to-secondary/10 dark:from-indigo-500/5 dark:via-primary/5 dark:to-secondary/5 rounded-xl shadow-inner border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <AlertOctagon className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Disclaimer & Further Action</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          The information on this page is intended for general guidance and awareness within the BScAI Unity community. It does not constitute legal advice or an exhaustive list of all rights and responsibilities.
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          For official policies, grievance procedures, and detailed information on student rights and conduct, please ALWAYS refer to the official handbooks, websites, and communications provided by IIT Jodhpur and Futurense. BScAI Unity encourages informed advocacy through official channels.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default KnowYourRightsPage;
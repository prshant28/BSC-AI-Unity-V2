import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Edit3, Users, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactPage = () => {
  const contactPoints = [
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: "Primary Email (Future)",
      description: "Our dedicated email for official communication will be voice@bscaiunity.space. This will be activated soon for direct inquiries and important matters.",
      actionText: null,
      actionLink: null,
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Contact Form (Future)",
      description: "A secure contact form (potentially using Formspree or a similar service) will be available for direct messaging and structured feedback submission.",
      actionText: null,
      actionLink: null,
    },
    {
      icon: <Edit3 className="h-8 w-8 text-primary" />,
      title: "Suggestion Box (Future)",
      description: "Anonymously or openly share your ideas and suggestions for improving this platform, the course, or our student community. Your insights are valuable.",
      actionText: null,
      actionLink: null,
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Channels",
      description: "For immediate discussions and peer-to-peer support, please continue to use existing batch WhatsApp groups or other established communication channels.",
      actionText: null,
      actionLink: null,
    }
  ];
  
  const programInfo = "The B.Sc./BS in Applied AI and Data Science at IIT Jodhpur is a fully online degree launched in collaboration with Futurense Uni. It's designed for both students and working professionals, offering flexibility and an industry-focused curriculum without requiring JEE for admission.";


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
        Connect With Us
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Your input is invaluable for the growth and success of BScAI Unity. We are actively developing multiple channels for communication. Here's how you can (or will soon be able to) reach out and contribute.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {contactPoints.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="h-full bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-all shadow-lg hover:shadow-xl">
              <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                {point.icon}
                <CardTitle className="text-xl text-foreground">{point.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{point.description}</p>
                {point.actionText && point.actionLink && (
                  <Button asChild variant="link" className="p-0 h-auto text-primary hover:underline">
                    <a href={point.actionLink} target="_blank" rel="noopener noreferrer">
                      {point.actionText} <ExternalLink className="ml-1.5 h-3.5 w-3.5"/>
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="text-center p-8 md:p-12 bg-gradient-to-r from-indigo-500/10 via-primary/10 to-secondary/10 dark:from-indigo-500/5 dark:via-primary/5 dark:to-secondary/5 rounded-xl shadow-inner border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Info className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">A Quick Note on the Program</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          {programInfo} BScAI Unity serves as a student-driven platform to enhance this experience.
        </p>
        <p className="text-sm text-muted-foreground">
          Effective communication is the cornerstone of a strong community. We are committed to establishing transparent and accessible channels for all students of the B.Sc. (Applied AI & DS) 2024 batch. Your patience and participation are appreciated as we build these out.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
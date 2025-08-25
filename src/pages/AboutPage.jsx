import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, ShieldCheck, Globe, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const coreValues = [
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: "Student-Managed Platform",
      description: "BScAI Unity is entirely conceived, developed, and managed by students of the B.Sc. (Applied AI & Data Science) 2024 batch at IIT Jodhpur. We are an independent voice, working for the collective good of our batch."
    },
    {
      icon: <Target className="h-10 w-10 text-primary mb-4" />,
      title: "Our Unifying Mission",
      description: "To unite students across India in this pioneering program, providing a transparent platform to voice academic, technical, and administrative concerns, and to collectively seek constructive solutions and improvements."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
      title: "Integrity and Respectful Dialogue",
      description: "We operate with integrity, ensuring all discussions are respectful towards peers, faculty, and administrative bodies. Our goal is constructive dialogue to improve the student experience while upholding the program's vision."
    },
    {
      icon: <Globe className="h-10 w-10 text-primary mb-4" />,
      title: "Nationwide Representation & Inclusivity",
      description: "This platform represents voices from diverse backgrounds across India, all part of the first B.Sc. (Applied AI & DS) batch. We celebrate this diversity and strive for an inclusive environment where every voice is heard."
    }
  ];

  const programIntro = "IIT Jodhpur ka BSc/BS in Applied AI and Data Science ek fully online, industry-focused degree hai, jo Futurense Uni ke saath milke launch hua hai. Yeh program students aur working professionals dono ke liye design kiya gaya hai, jisse flexibility aur accessibility badhti hai.";

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
        About BScAI Unity
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        BScAI Unity is a collective platform by students, for students of the first-ever B.Sc. (Applied AI & Data Science) batch 2024 at IIT Jodhpur. We are not officially affiliated with IIT Jodhpur or Futurense; this is a fully student-managed initiative to champion our collective interests and foster a strong, supportive community.
      </motion.p>
      <motion.div 
        className="max-w-3xl mx-auto mb-12 p-6 bg-primary/5 border border-primary/20 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <p className="text-md text-foreground text-center leading-relaxed">
          <Lightbulb className="inline-block h-6 w-6 mr-2 text-primary" />
          {programIntro}
        </p>
      </motion.div>


      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        {coreValues.map((value, index) => (
          <motion.div
            key={value.title}
            className="p-6 rounded-xl shadow-lg bg-card/60 backdrop-blur-sm border border-border hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
          >
            {value.icon}
            <h2 className="text-xl font-semibold text-foreground mb-2 mt-2">{value.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{value.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="text-center bg-gradient-to-r from-indigo-500/10 via-primary/10 to-secondary/10 dark:from-indigo-500/5 dark:via-primary/5 dark:to-secondary/5 p-8 md:p-12 rounded-xl shadow-inner border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Pioneering Together, Voicing Concerns Unitedly</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          As the inaugural batch, we have a unique opportunity and responsibility to shape the future of this program. BScAI Unity is our dedicated space to collaborate, innovate, and ensure our collective journey is both challenging and rewarding. We believe in proactive communication and problem-solving.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          We are committed to building a platform that evolves with our needs, incorporating features like anonymous grievance submissions, community integrations, and more, always driven by student input and democratic principles.
        </p>
        <Button asChild size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link to="/add-concern">
            Share Your Thoughts <Users className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
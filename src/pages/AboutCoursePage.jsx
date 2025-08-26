
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Users, AlertTriangle, Award, Brain, CalendarDays, DollarSign, Users2, CheckCircle, TrendingUp, FileText, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AboutCoursePage = () => {
  const courseInfo = {
    intro: "The B.Sc./BS in Applied AI and Data Science at IIT Jodhpur is a fully online, industry-focused degree program launched in collaboration with Futurense University. No JEE entrance exam is required—just 60% marks in 12th grade with Mathematics and clearing a qualifying test.",
    structure: {
      title: "Course Structure & Duration",
      points: [
        "4-year stackable degree model:",
        "1st year: Certificate completion",
        "2nd year: Diploma completion", 
        "3rd year: Bachelor of Science (B.Sc.) Degree",
        "4th year: Bachelor of Science (BS) Degree",
        "Optional annual campus immersion (3-5 days) at IIT Jodhpur to meet industry experts and professors"
      ]
    },
    curriculum: {
      title: "Curriculum Highlights",
      points: [
        "Comprehensive coverage: AI fundamentals, Machine Learning, Deep Learning, Natural Language Processing (NLP), Generative AI, Large Language Models (LLMs), Prompt Engineering, Computer Vision, Data Security, Reinforcement Learning, Data Analytics, and advanced topics",
        "Practical learning: Real-world projects, live weekend sessions, self-paced video lectures, interactive quizzes, comprehensive assignments, and mentorship from MAANG (Meta, Amazon, Apple, Netflix, Google) industry leaders",
        "Capstone experience: Final year options include industry capstone projects or research thesis opportunities"
      ]
    },
    fees: {
      title: "Fee Structure & Learning Format",
      points: [
        "Annual tuition: ₹1,09,000 + ₹10,000 application fee (campus immersion fees are additional if you choose to attend)",
        "Fully online delivery with flexible scheduling, plus optional annual campus visits for hands-on experience and networking"
      ]
    },
    career: {
      title: "Career Opportunities",
      points: [
        "Graduate-ready roles: Data Scientist, AI Engineer, Machine Learning Engineer, NLP Engineer, Computer Vision Engineer, Business Analyst, Data Analyst, and emerging AI-focused positions",
        "Industry advantage: IIT brand recognition and extensive industry exposure significantly enhance placement opportunities and career prospects"
      ]
    },
    admission: {
      title: "Admission Process",
      points: [
        "Complete online application form with required documents",
        "Take and pass the program-specific qualifying assessment",
        "Receive and accept offer letter to confirm admission"
      ]
    },
    outro: "This program is designed for both fresh students and working professionals, offering exceptional flexibility in learning. Upon successful completion, you gain prestigious IIT Jodhpur alumni status and access to the extensive alumni network."
  };

  const uniqueFeatures = [
    { icon: <Award className="h-7 w-7 text-green-600" />, title: "IIT Jodhpur Degree", description: "Earn a prestigious B.Sc./BS degree from an Indian Institute of Technology, significantly enhancing your career prospects." },
    { icon: <Brain className="h-7 w-7 text-blue-600" />, title: "AI-Focused Curriculum", description: "Specialized, industry-relevant curriculum covering cutting-edge topics in Applied AI and Data Science with real-world applications." },
    { icon: <Zap className="h-7 w-7 text-purple-600" />, title: "Online Delivery & Flexibility", description: "Flexible learning model accessible from anywhere, perfectly suited for students and working professionals." },
    { icon: <Users className="h-7 w-7 text-yellow-600" />, title: "Industry Mentorship & Projects", description: "Direct guidance from MAANG industry leaders and opportunities to work on real-world, industry-relevant projects." },
    { icon: <UserCheck className="h-7 w-7 text-indigo-600" />, title: "IIT Alumni Status", description: "Become part of the prestigious IIT Jodhpur alumni network upon program completion, opening doors to exclusive opportunities." },
    { icon: <TrendingUp className="h-7 w-7 text-pink-600" />, title: "Stackable Degree Model", description: "Multiple exit options with valuable certifications at each stage (Certificate, Diploma, B.Sc., BS) providing flexibility in your educational journey." },
  ];

  const limitations = [
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Limited Live Interaction", description: "Primary reliance on recorded lectures can make immediate doubt clarification challenging for some students." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Platform & Support Issues", description: "Occasional technical glitches or delays in support responses from the delivery partner (Futurense) may occur." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "New Program Evolution", description: "As a pioneering program, some aspects of student support and operational processes are still being refined and improved." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Self-Discipline Required", description: "The online learning format demands a high degree of self-motivation and effective time management skills from students." },
  ];

  const SectionCard = ({ title, points, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-card/70 backdrop-blur-sm border-border hover:border-primary/30">
        <CardHeader className="flex flex-row items-center space-x-3 pb-3">
          {icon}
          <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-inside">
            {points.map((point, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 sm:py-12 px-4 md:px-6"
    >
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About The B.Sc. (Applied AI & Data Science) Program
      </motion.h1>
      <motion.p 
        className="text-base sm:text-lg text-muted-foreground text-center max-w-4xl mx-auto mb-8 sm:mb-12 px-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {courseInfo.intro} This page provides a comprehensive overview of the program structure, curriculum, fees, and career prospects.
      </motion.p>

      <section className="mb-12 sm:mb-16 space-y-6 sm:space-y-8">
        <SectionCard title={courseInfo.structure.title} points={courseInfo.structure.points} icon={<FileText className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfo.curriculum.title} points={courseInfo.curriculum.points} icon={<BookOpen className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfo.fees.title} points={courseInfo.fees.points} icon={<DollarSign className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfo.career.title} points={courseInfo.career.points} icon={<TrendingUp className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfo.admission.title} points={courseInfo.admission.points} icon={<UserCheck className="h-7 w-7 text-primary" />} />
      </section>
      
      <motion.p 
        className="text-sm sm:text-base text-muted-foreground text-center max-w-4xl mx-auto mb-12 sm:mb-16 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {courseInfo.outro}
      </motion.p>

      <section className="mb-12 sm:mb-16">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Key Program Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {uniqueFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-card/70 backdrop-blur-sm border-green-500/10 hover:border-green-500/30">
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  {feature.icon}
                  <CardTitle className="text-base sm:text-lg text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Acknowledged Limitations & Challenges
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {limitations.map((limitation, index) => (
            <motion.div
              key={limitation.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-card/70 backdrop-blur-sm border-red-500/10 hover:border-red-500/30">
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  {limitation.icon}
                  <CardTitle className="text-base sm:text-lg text-foreground">{limitation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{limitation.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
         <motion.p 
            className="text-xs sm:text-sm text-muted-foreground text-center max-w-4xl mx-auto mt-8 sm:mt-10 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            Note: These points reflect student-observed challenges in the B.Sc. Applied AI & Data Science program. This platform, BScAI Unity, aims to constructively address these by consolidating student voices and fostering open dialogue between students, faculty, and administration.
          </motion.p>
      </section>
    </motion.div>
  );
};

export default AboutCoursePage;

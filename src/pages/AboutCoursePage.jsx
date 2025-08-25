import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Users, AlertTriangle, Award, Brain, CalendarDays, DollarSign, Users2, CheckCircle, TrendingUp, FileText, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AboutCoursePage = () => {
  const courseInfoHinglish = {
    intro: "Bhai, IIT Jodhpur ka BSc/BS in Applied AI and Data Science ek fully online, industry-focused degree hai, jo Futurense Uni ke saath milke launch hua hai. Isme admission ke liye JEE ki zarurat nahi hai—bas 12th me Maths ke saath 60% marks chahiye, aur ek qualifying test clear karna hota hai.",
    structure: {
      title: "Course Structure & Duration",
      points: [
        "4 saal ka stackable degree model hai:",
        "1st year: Certification",
        "2nd year: Diploma",
        "3rd year: BSc Degree",
        "4th year: BS Degree",
        "Har saal optional campus immersion (3-5 din) hota hai IIT Jodhpur me, jahan aap industry experts aur professors se mil sakte ho."
      ]
    },
    curriculum: {
      title: "Curriculum Highlights",
      points: [
        "AI fundamentals, Machine Learning, Deep Learning, NLP, Generative AI, LLMs (Large Language Models), Prompt Engineering, Computer Vision, Data Security, Reinforcement Learning, Data Analytics, and more.",
        "Real-world projects, live weekend sessions, self-paced video lectures, quizzes, assignments, and mentorship from MAANG industry leaders.",
        "Final year me aapko capstone project ya research thesis ka option milta hai."
      ]
    },
    fees: {
      title: "Fees & Format",
      points: [
        "Annual fee: ₹1,09,000 + ₹10,000 application fee (immersion fees extra, if you opt for campus visits).",
        "Completely online classes, but aap chahe toh har saal campus visit bhi kar sakte ho for hands-on experience."
      ]
    },
    career: {
      title: "Career Scope",
      points: [
        "Course ke baad aap Data Scientist, AI Engineer, NLP Engineer, Computer Vision Engineer, Business/Data Analyst, etc. ban sakte ho.",
        "IIT ka tag aur industry exposure placements me kaafi help karta hai."
      ]
    },
    admission: {
      title: "Admission Process",
      points: [
        "Online application form bharna",
        "Qualifying test dena",
        "Offer letter milne par admission confirm karna."
      ]
    },
    outro: "Yeh program students aur working professionals dono ke liye hai, toh flexibility kaafi achhi hai. Aur haan, is degree ke baad aapko IIT Jodhpur alumni status bhi milta hai."
  };

  const uniqueFeatures = [
    { icon: <Award className="h-7 w-7 text-green-600" />, title: "IIT Jodhpur Degree", description: "Earn a prestigious B.Sc./BS degree from an Indian Institute of Technology, enhancing your career prospects." },
    { icon: <Brain className="h-7 w-7 text-blue-600" />, title: "AI-Focused Curriculum", description: "Specialized, industry-relevant curriculum covering cutting-edge topics in Applied AI and Data Science." },
    { icon: <Zap className="h-7 w-7 text-purple-600" />, title: "Online Delivery & Flexibility", description: "Flexible learning model accessible from anywhere, suitable for students and working professionals." },
    { icon: <Users className="h-7 w-7 text-yellow-600" />, title: "Industry Mentorship & Projects", description: "Guidance from MAANG leaders and opportunities to work on real-world projects." },
    { icon: <UserCheck className="h-7 w-7 text-indigo-600" />, title: "IIT Alumni Status", description: "Become part of the esteemed IIT Jodhpur alumni network upon completion." },
    { icon: <TrendingUp className="h-7 w-7 text-pink-600" />, title: "Stackable Degree Model", description: "Multiple exit options with certifications at each stage (Certificate, Diploma, BSc, BS)." },
  ];

  const limitations = [
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Limited Live Interaction", description: "Primary reliance on recorded lectures can make immediate doubt clarification challenging for some." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Platform & Support Issues", description: "Occasional technical glitches or delays in support from the delivery partner (Futurense) can occur." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "New Program Evolution", description: "As a pioneering program, some aspects of support and operations are still maturing." },
    { icon: <AlertTriangle className="h-7 w-7 text-red-600" />, title: "Self-Discipline Required", description: "The online format demands a high degree of self-motivation and time management from students." },
  ];

  const SectionCard = ({ title, points, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
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
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About The B.Sc. (Applied AI & DS) Program
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {courseInfoHinglish.intro} This page provides a comprehensive overview of the program structure, curriculum, fees, and career prospects.
      </motion.p>

      <section className="mb-16 space-y-8">
        <SectionCard title={courseInfoHinglish.structure.title} points={courseInfoHinglish.structure.points} icon={<FileText className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfoHinglish.curriculum.title} points={courseInfoHinglish.curriculum.points} icon={<BookOpen className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfoHinglish.fees.title} points={courseInfoHinglish.fees.points} icon={<DollarSign className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfoHinglish.career.title} points={courseInfoHinglish.career.points} icon={<TrendingUp className="h-7 w-7 text-primary" />} />
        <SectionCard title={courseInfoHinglish.admission.title} points={courseInfoHinglish.admission.points} icon={<UserCheck className="h-7 w-7 text-primary" />} />
      </section>
      
      <motion.p 
        className="text-md text-muted-foreground text-center max-w-3xl mx-auto mb-16 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {courseInfoHinglish.outro}
      </motion.p>


      <section className="mb-16">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Key Program Features
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                  <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
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
          className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Acknowledged Limitations & Challenges
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
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
                  <CardTitle className="text-lg text-foreground">{limitation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{limitation.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
         <motion.p 
            className="text-sm text-muted-foreground text-center max-w-3xl mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            Note: These points reflect student-observed challenges. This platform, BScAI Unity, aims to constructively address these by consolidating student voices and fostering open dialogue.
          </motion.p>
      </section>
    </motion.div>
  );
};

export default AboutCoursePage;
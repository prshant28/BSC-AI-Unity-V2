import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  HERO_SUBHEADING,
  HERO_CTA_BUTTONS,
  HERO_ADDITIONAL_INFO,
} from "@/lib/constants";
import { PlusCircle, ListChecks, BookOpen, CheckCircle } from "lucide-react";

const HeroSection = () => {
  const getIconForButton = (label) => {
    if (label.toLowerCase().includes("add"))
      return <PlusCircle className="mr-2 h-5 w-5" />;
    if (label.toLowerCase().includes("view"))
      return <ListChecks className="mr-2 h-5 w-5" />;
    if (
      label.toLowerCase().includes("learn") ||
      label.toLowerCase().includes("course")
    )
      return <BookOpen className="mr-2 h-5 w-5" />;
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 90 },
    },
  };

  return (
    <motion.section
      className="relative pt-28 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-background via-indigo-50 dark:via-slate-900 to-slate-100 dark:to-indigo-900/20 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="heroPatternV3"
              patternUnits="userSpaceOnUse"
              width="70"
              height="70"
              patternTransform="scale(1.8) rotate(15)"
            >
              <rect x="0" y="0" width="100%" height="100%" fill="none" />
              <path
                d="M0 35h70M35 0v70"
                strokeWidth="0.4"
                stroke="hsl(var(--primary))"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroPatternV3)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight min-h-[80px] sm:min-h-[100px] md:min-h-[120px]"
          variants={itemVariants}
        >
          <span className="block gradient-text">Pioneering the Future.</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          variants={itemVariants}
        >
          {HERO_SUBHEADING}
        </motion.p>

        <motion.div
          className="max-w-2xl mx-auto mb-10 text-left"
          variants={itemVariants}
        >
          <ul className="space-y-2">
            {HERO_ADDITIONAL_INFO.map((info, index) => (
              <li
                key={index}
                className="flex items-start text-sm md:text-base text-muted-foreground"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          variants={itemVariants}
        >
          {HERO_CTA_BUTTONS.map((button, index) => (
            <Button
              key={index}
              asChild
              size="lg"
              variant={button.variant}
              className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-base py-6 px-8"
            >
              <Link to={button.href}>
                {getIconForButton(button.label)}
                {button.label}
              </Link>
            </Button>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;

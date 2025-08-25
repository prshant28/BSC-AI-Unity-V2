import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TYPING_TEXTS_HERO, HERO_SUBHEADING, HERO_CTA_BUTTONS, HERO_ADDITIONAL_INFO } from '@/lib/constants';
import { PlusCircle, ListChecks, BookOpen, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef(110); 
  const animationFrameIdRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    const currentText = TYPING_TEXTS_HERO[textIndex];

    const typeTick = (timestamp) => {
      animationFrameIdRef.current = requestAnimationFrame(typeTick);
      if (timestamp - lastUpdateTimeRef.current < typingSpeedRef.current) {
        return;
      }
      lastUpdateTimeRef.current = timestamp;

      setDisplayText(prev => {
        if (isDeleting) {
          if (prev.length > 0) {
            return prev.substring(0, prev.length - 1);
          } else {
            setIsDeleting(false);
            setTextIndex(currentIdx => (currentIdx + 1) % TYPING_TEXTS_HERO.length);
            typingSpeedRef.current = 110;
            return '';
          }
        } else {
          if (prev.length < currentText.length) {
            return currentText.substring(0, prev.length + 1);
          } else {
            typingSpeedRef.current = 2800; // Pause before deleting
            setIsDeleting(true);
            return prev;
          }
        }
      });

      if (isDeleting && displayText.length === 0) {
         typingSpeedRef.current = 55; // Deleting speed
      } else if (!isDeleting && displayText === currentText) {
         typingSpeedRef.current = 2800; // Pause after typing full text
      } else if (isDeleting) {
         typingSpeedRef.current = 55;
      } else {
         typingSpeedRef.current = 110; // Typing speed
      }
    };
    
    lastUpdateTimeRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(typeTick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [displayText, isDeleting, textIndex]);


  const getIconForButton = (label) => {
    if (label.toLowerCase().includes("add")) return <PlusCircle className="mr-2 h-5 w-5" />;
    if (label.toLowerCase().includes("view")) return <ListChecks className="mr-2 h-5 w-5" />;
    if (label.toLowerCase().includes("learn") || label.toLowerCase().includes("course")) return <BookOpen className="mr-2 h-5 w-5" />;
    return null;
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-background via-indigo-50 dark:via-slate-900 to-slate-100 dark:to-indigo-900/20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroPatternV3" patternUnits="userSpaceOnUse" width="70" height="70" patternTransform="scale(1.8) rotate(15)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M0 35h70M35 0v70"  strokeWidth="0.4" stroke="hsl(var(--primary))" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroPatternV3)"/></svg>
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight min-h-[80px] sm:min-h-[100px] md:min-h-[120px]"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        >
          <span className="block gradient-text">{displayText}</span>
          <span className="opacity-50 animate-caret-blink text-primary text-5xl md:text-6xl lg:text-7xl select-none">|</span>
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 100 }}
        >
          {HERO_SUBHEADING}
        </motion.p>
        
        <motion.div 
          className="max-w-2xl mx-auto mb-10 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, type: 'spring', stiffness: 100 }}
        >
          <ul className="space-y-2">
            {HERO_ADDITIONAL_INFO.map((info, index) => (
              <li key={index} className="flex items-start text-sm md:text-base text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, type: 'spring', stiffness: 100 }}
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
    </section>
  );
};

export default HeroSection;
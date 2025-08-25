import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '@/lib/constants';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const activeLinkClass = "text-primary font-semibold";
  const inactiveLinkClass = "text-foreground/80 hover:text-primary transition-colors duration-200";
  
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "border-b bg-background/90 backdrop-blur-lg shadow-sm" : "bg-transparent border-b border-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Sparkles className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-[25deg] group-hover:scale-110" />
          <span className="text-2xl font-bold gradient-text tracking-tight">BScAI Unity</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map((link, index) => (
            <motion.div key={link.label} custom={index} variants={navItemVariants} initial="hidden" animate="visible">
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn("px-3 py-2 rounded-md text-sm font-medium", isActive ? activeLinkClass : inactiveLinkClass)
                }
              >
                {link.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.08, 0.65, 0.53, 0.96] }} // Custom ease for smoother feel
            className="md:hidden border-t bg-background/95 shadow-lg"
          >
            <nav className="flex flex-col space-y-1 p-4">
              {NAV_LINKS.map((link, index) => (
                <motion.div 
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={() => setTimeout(() => setMobileMenuOpen(false), 150)}
                    className={({ isActive }) =>
                      cn("block py-3 px-4 rounded-lg text-base font-medium transition-all duration-200", 
                         isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-primary/5 hover:text-primary')
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
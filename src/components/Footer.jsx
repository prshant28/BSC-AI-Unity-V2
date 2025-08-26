import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Linkedin, Twitter, Github, Send } from 'lucide-react'; // Assuming Send for Telegram
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const iconMap = {
    Linkedin: <Linkedin className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    Github: <Github className="h-5 w-5" />,
    Send: <Send className="h-5 w-5" />, // For Telegram
    // Add more icons if needed
  };

  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">BScAI Unity</span>
            </Link>
            <p className="text-sm leading-relaxed">
              A student-led initiative for the B.Sc. (Applied AI & Data Science) 2024 batch at IIT Jodhpur. Uniting voices, addressing concerns, and fostering community.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-3">Explore</p>
            <ul className="space-y-2">
              {FOOTER_LINKS.EXPLORE.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm hover:text-primary transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-3">Connect</p>
            <ul className="space-y-2">
              {FOOTER_LINKS.CONNECT.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm hover:text-primary transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-foreground mb-3">Legal</p>
            <ul className="space-y-2">
              {FOOTER_LINKS.LEGAL.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm hover:text-primary transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-xs text-center md:text-left">
              &copy; {currentYear} BScAI Unity. All rights reserved. Student-managed platform.
              <br />
              Hosted at <a href="http://bscaiunity.space" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">bscaiunity.space</a>. Not officially affiliated with IIT Jodhpur or Futurense.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="https://www.buymeacoffee.com/prshant.dev" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" 
                  alt="Buy Me A Coffee" 
                  style={{height: '40px', width: '145px'}}
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
          {SOCIAL_LINKS.length > 0 && (
            <div className="flex space-x-3 mt-4 md:mt-0">
              {SOCIAL_LINKS.map(social => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label={social.name}>
                  {iconMap[social.icon] || social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
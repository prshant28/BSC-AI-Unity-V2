import React from 'react';
import HeroSection from '@/components/HeroSection';
import ConcernCard from '@/components/ConcernCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, BarChart3, PlusCircle, Lightbulb, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = ({ concerns, loading }) => {
  const latestConcerns = concerns.slice(0, 3);

  const quickLinks = [
    { title: "About The Course", href: "/about-course", icon: <BookOpen className="h-8 w-8 mb-3 text-primary"/>, description: "Explore details of the B.Sc. Applied AI & DS program at IIT Jodhpur." },
    { title: "Our Community", href: "/about", icon: <Users className="h-8 w-8 mb-3 text-primary"/>, description: "Learn about BScAI Unity, our mission, and our student-led approach." },
    { title: "Concern Statistics", href: "/status-board", icon: <BarChart3 className="h-8 w-8 mb-3 text-primary"/>, description: "View current statistics on concern submissions and resolutions." },
  ];

  const programBrief = "IIT Jodhpur's B.Sc./BS in Applied AI and Data Science is a pioneering fully online degree, offered in collaboration with Futurense Uni. It features a flexible, stackable 4-year model, an industry-focused curriculum, and does not require JEE for admission—only 60% in 12th (Maths) and a qualifying test. Annual fee: ₹1,09,000 + application fee.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            Latest Concerns
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay updated with the most recent issues, discussions, and resolutions within our pioneering batch. Your voice contributes to our collective progress.
          </motion.p>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : latestConcerns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {latestConcerns.map((concern, index) => (
                <ConcernCard key={concern.id || index} concern={concern} index={index} />
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center text-muted-foreground italic my-12 p-8 border border-dashed rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lightbulb className="h-10 w-10 mx-auto mb-3 text-primary/70" />
              <p className="text-lg">No concerns posted yet. Be the first to share your thoughts!</p>
              <Button asChild size="lg" className="mt-6 group bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/add-concern">
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Your Concern
                </Link>
              </Button>
            </motion.div>
          )}
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: latestConcerns.length > 0 ? 0.2 : 0 }}
          >
            <Button asChild size="lg" variant="outline" className="group border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <Link to="/concerns">
                View All Concerns
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-16 shadow-xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl gradient-text text-center">
                  <Lightbulb className="inline-block h-7 w-7 mr-2" />
                  Quick Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed max-w-3xl mx-auto">{programBrief}</p>
                <div className="text-center mt-6">
                  <Button asChild variant="soft" className="text-primary group hover:underline">
                     <Link to="/about-course">
                        Discover Full Program Details <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                     </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            Explore More
          </motion.h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center border border-border hover:border-primary/40">
                  {link.icon}
                  <h3 className="text-xl font-semibold text-foreground mb-2 mt-1">{link.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{link.description}</p>
                  <Button asChild variant="link" className="text-primary group hover:underline">
                    <Link to={link.href}>
                      Learn More <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
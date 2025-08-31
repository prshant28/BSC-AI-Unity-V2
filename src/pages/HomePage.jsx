
import React from "react";
import HeroSection from "@/components/HeroSection";
import ConcernCard from "@/components/ConcernCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  PlusCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  CheckCircle,
  Clock,
  GraduationCap,
  Trophy,
  Target,
  Zap,
  Star,
  Heart,
  Sparkles,
  ExternalLink,
  Calendar,
  Brain,
  Code,
  Award,
  Gamepad2,
  Gift,
  Bell,
  FileText,
  Vote,
  Search,
  Cpu,
  Shield,
  Globe,
  Rocket,
  TrendingUp,
  Compass,
  Megaphone,
  Users2,
  Briefcase,
  PenTool,
  Database,
  Monitor,
  Headphones,
  Camera,
  Map,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomePage = ({ concerns, loading }) => {
  const latestConcerns = concerns.slice(0, 3);

  const platformFeatures = [
    {
      title: "AI Tools Hub",
      href: "/ai-tools",
      icon: <Brain className="h-8 w-8 mb-3 text-blue-500" />,
      description: "Discover 100+ AI tools for coding, research, writing, and academic success",
      image: "🤖",
      category: "AI & Tech",
      badge: "100+ Tools",
    },
    {
      title: "Academic Concerns",
      href: "/add-concern",
      icon: <MessageSquare className="h-8 w-8 mb-3 text-red-500" />,
      description: "Submit and track academic issues with transparent resolution system",
      image: "💬",
      category: "Support",
      badge: "24/7 Support",
    },
    {
      title: "Events Calendar",
      href: "/events",
      icon: <Calendar className="h-8 w-8 mb-3 text-green-500" />,
      description: "Stay updated with class schedules, assignments, and important dates",
      image: "📅",
      category: "Schedule",
      badge: "Live Updates",
    },
    {
      title: "Notice Board",
      href: "/notices",
      icon: <Bell className="h-8 w-8 mb-3 text-orange-500" />,
      description: "Important announcements, updates, and program notifications",
      image: "📢",
      category: "Updates",
      badge: "Real-time",
    },
    {
      title: "Polls & Surveys",
      href: "/polls-surveys",
      icon: <Vote className="h-8 w-8 mb-3 text-purple-500" />,
      description: "Participate in student feedback polls and program surveys",
      image: "🗳️",
      category: "Feedback",
      badge: "Your Voice",
    },
    {
      title: "Semester Quizzes",
      href: "/semester-quizzes",
      icon: <Award className="h-8 w-8 mb-3 text-indigo-500" />,
      description: "Practice quizzes and assessments for all subjects",
      image: "🎯",
      category: "Practice",
      badge: "Skill Building",
    },
    {
      title: "Discussion Forum",
      href: "https://discourse.bscaiunity.space",
      icon: <Users2 className="h-8 w-8 mb-3 text-cyan-500" />,
      description: "Connect with fellow students in our community discussion forum",
      image: "💭",
      category: "Community",
      badge: "External",
      external: true,
    },
    {
      title: "Status Dashboard",
      href: "/status-board",
      icon: <BarChart3 className="h-8 w-8 mb-3 text-teal-500" />,
      description: "Track concern resolution stats and platform analytics",
      image: "📊",
      category: "Analytics",
      badge: "Live Data",
    },
    {
      title: "Contact Support",
      href: "/contact",
      icon: <Headphones className="h-8 w-8 mb-3 text-pink-500" />,
      description: "Get help from academic advisors and program coordinators",
      image: "📞",
      category: "Support",
      badge: "Expert Help",
    },
  ];

  const aiToolCategories = [
    { name: "Writing & Research", icon: "✍️", count: "25+ Tools", color: "bg-blue-500" },
    { name: "Programming & Code", icon: "💻", count: "20+ Tools", color: "bg-green-500" },
    { name: "Design & Creative", icon: "🎨", count: "15+ Tools", color: "bg-purple-500" },
    { name: "Data Science & ML", icon: "📊", count: "18+ Tools", color: "bg-orange-500" },
    { name: "Language Learning", icon: "🗣️", count: "12+ Tools", color: "bg-red-500" },
    { name: "Productivity", icon: "⚡", count: "20+ Tools", color: "bg-cyan-500" },
  ];

  const studentServices = [
    {
      title: "Hackathon Opportunities",
      description: "AI/DS focused hackathons and competitions matching our curriculum",
      icon: <Code className="h-6 w-6" />,
      color: "text-blue-600",
      emoji: "🏆",
    },
    {
      title: "Student Deals & Offers",
      description: "Exclusive discounts on software, courses, and learning resources",
      icon: <Gift className="h-6 w-6" />,
      color: "text-green-600",
      emoji: "💰",
    },
    {
      title: "Academic Progress Tracking",
      description: "Monitor your semester progress and achievement milestones",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-600",
      emoji: "📈",
    },
    {
      title: "Peer Learning Network",
      description: "Connect with batch-mates for study groups and collaboration",
      icon: <Users className="h-6 w-6" />,
      color: "text-orange-600",
      emoji: "🤝",
    },
  ];

  const achievements = [
    { number: "100+", label: "AI Tools", icon: "🤖", color: "text-blue-500" },
    { number: "50+", label: "Students", icon: "👥", color: "text-green-500" },
    { number: "24/7", label: "Support", icon: "🛟", color: "text-purple-500" },
    { number: "4", label: "Semesters", icon: "📚", color: "text-orange-500" },
  ];

  const quickActions = [
    {
      title: "Submit Concern",
      href: "/add-concern",
      icon: <PlusCircle className="h-5 w-5" />,
      variant: "default",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "Browse AI Tools",
      href: "/ai-tools",
      icon: <Brain className="h-5 w-5" />,
      variant: "secondary",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Check Events",
      href: "/events",
      icon: <Calendar className="h-5 w-5" />,
      variant: "outline",
      color: "border-green-500 text-green-500 hover:bg-green-50",
    },
    {
      title: "Take Quiz",
      href: "/semester-quizzes",
      icon: <Trophy className="h-5 w-5" />,
      variant: "ghost",
      color: "text-purple-500 hover:bg-purple-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-purple-50 to-blue-50 dark:from-primary/10 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className={`text-2xl font-bold ${achievement.color} mb-1`}>
                  {achievement.number}
                </h3>
                <p className="text-sm text-muted-foreground">{achievement.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  asChild
                  variant={action.variant}
                  size="lg"
                  className={`group ${action.color} transform hover:scale-105 transition-all`}
                >
                  <Link to={action.href}>
                    {action.icon}
                    <span className="ml-2">{action.title}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Platform Features */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Your Complete Academic Companion
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Everything you need for B.Sc. Applied AI & Data Science success - from AI tools to academic support, 
              all in one powerful platform designed by students, for students.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  {feature.external && (
                    <div className="absolute top-3 left-3">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {feature.image}
                    </div>
                    <div className="group-hover:scale-110 transition-transform duration-300 mb-4">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">
                      {feature.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="group w-full"
                    >
                      {feature.external ? (
                        <a href={feature.href} target="_blank" rel="noopener noreferrer">
                          Explore <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      ) : (
                        <Link to={feature.href}>
                          Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Showcase */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              AI Tools Arsenal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access our carefully curated collection of AI tools designed specifically for your coursework
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiToolCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all group">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <Badge className={`${category.color} text-white`}>
                    {category.count}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="group">
              <Link to="/ai-tools">
                <Brain className="mr-2 h-5 w-5" />
                Explore All AI Tools
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Student Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Student Success Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond tools - we provide opportunities, support, and resources tailored for your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {studentServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{service.emoji}</div>
                    <div>
                      <div className={`${service.color} mb-2`}>
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Concerns Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            Latest Student Concerns
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay updated with recent issues, discussions, and resolutions from our pioneering batch community.
          </motion.p>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : latestConcerns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {latestConcerns.map((concern, index) => (
                <ConcernCard
                  key={concern.id || index}
                  concern={concern}
                  index={index}
                  isAdmin={false}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center text-muted-foreground italic my-12 p-8 border border-dashed rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🚀</div>
              <Lightbulb className="h-10 w-10 mx-auto mb-3 text-primary/70" />
              <p className="text-lg">
                No concerns posted yet. Be the first to share your thoughts!
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 group bg-primary hover:bg-primary/90 text-primary-foreground"
              >
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
            transition={{
              duration: 0.5,
              delay: latestConcerns.length > 0 ? 0.2 : 0,
            }}
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/concerns">
                View All Concerns
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Why Choose BScAI Unity?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by the first batch, for the first batch - and all future pioneers of AI & Data Science
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="h-8 w-8 text-green-500" />,
                title: "Student-First",
                description: "Built by students who understand your challenges",
                emoji: "🛡️",
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Lightning Fast",
                description: "Quick access to tools and immediate concern responses",
                emoji: "⚡",
              },
              {
                icon: <Globe className="h-8 w-8 text-blue-500" />,
                title: "Always Updated",
                description: "Latest AI tools and program updates in real-time",
                emoji: "🌐",
              },
              {
                icon: <Heart className="h-8 w-8 text-red-500" />,
                title: "Community Driven",
                description: "Your feedback shapes the platform's evolution",
                emoji: "❤️",
              },
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all group">
                  <div className="text-4xl mb-4">{highlight.emoji}</div>
                  <div className="group-hover:scale-110 transition-transform duration-300 mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground text-sm">{highlight.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the AI & Data Science Revolution
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of India's first fully online B.Sc. Applied AI & Data Science program. 
              Your voice matters, your success is our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary group transform hover:scale-105 transition-all"
              >
                <Link to="/about-course">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Learn About The Program
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all"
              >
                <Link to="/add-concern">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Get Started Today
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm opacity-80">AI Tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4-Year</div>
                <div className="text-sm opacity-80">Program</div>
              </div>
              <div>
                <div className="text-2xl font-bold">IIT</div>
                <div className="text-sm opacity-80">Quality</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">Coming Soon</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Mobile App", icon: "📱" },
                { name: "Study Groups", icon: "👥" },
                { name: "AI Study Buddy", icon: "🤖" },
                { name: "Career Portal", icon: "💼" },
                { name: "Alumni Network", icon: "🎓" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="outline" className="px-4 py-2 text-sm">
                    {feature.icon} {feature.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;

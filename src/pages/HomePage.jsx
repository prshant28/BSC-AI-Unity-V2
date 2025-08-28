
import React from "react";
import HeroSection from "@/components/HeroSection";
import ConcernCard from "@/components/ConcernCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Star,
  Lightbulb,
  Target,
  Rocket,
  Shield,
  Zap,
  Globe,
  Award,
  BookOpen,
  Clock,
  Calendar,
  Download,
  ExternalLink,
  Sparkles,
  Heart,
  Coffee,
  Code,
  Database,
  Server,
  Smartphone,
  Laptop,
  Monitor,
  Headphones,
  Camera,
  Wifi,
  Battery,
  Settings,
  Search,
  Filter,
  Sort,
  Edit,
  Delete,
  Save,
  Share,
  Print,
  Upload,
  Play,
  Pause,
  Stop,
  Forward,
  Rewind,
  Volume,
  Mute,
  Home,
  Menu,
  Close,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Copy,
  Cut,
  Paste,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  Grid,
  Table,
  Image,
  LinkIcon,
  Unlink,
  Quote,
  Code2,
  Terminal,
  Bug,
  Wrench,
  Hammer,
  Paintbrush,
  Palette,
  Brush,
  Eraser,
  Ruler,
  Scissors,
  Paperclip,
  Pin,
  Flag,
  Tag,
  Bookmark,
  Folder,
  File,
  FileText,
  FilePlus,
  FileMinus,
  FileX,
  FileCheck,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  Archive,
  Package,
  Box,
  Inbox,
  Outbox,
  Send,
  Mail,
  Phone,
  Video,
  Mic,
  MicOff,
  Speaker,
  Voicemail,
  MessageCircle,
  MessageSquareMore,
  Bell,
  BellOff,
  Alert,
  AlertTriangle,
  AlertCircle,
  Info,
  Help,
  Question,
  Exclamation,
  Warning,
  Error,
  
  
  Sun,
  Moon,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Umbrella,
  Thermometer,
  Wind,
  Eye,
  EyeOff,
  
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  Coins,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  TrendingDown,
  BarChart,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Pulse,
  Gauge,
  Timer,
  Stopwatch,
  Hourglass,
  Alarm,
  AlarmClock,
  Sunrise,
  Sunset,
  Compass,
  Navigation,
  Map,
  MapPin,
  Locate,
  Route,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Walk,
  Run,
  Footprints,
  Paw,
  Leaf,
  Tree,
  Flower,
  Seedling,
  Sprout,
  Cactus,
  
  Fire,
  Flame,
  Campfire,
  Candle,
  Flashlight,
  Lamp,
  Bulb,
  Lightning,
  Bolt,
  Flash,
  Energy,
  Power,
  Plug,
  Cable,
  Calculator,
  Medal,
  Trophy,
  Crown,
  Infinity,
  Brain,
  GraduationCap,
  PlusCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = ({ concerns, loading }) => {
  const latestConcerns = concerns.slice(0, 3);

  const quickLinks = [
    {
      title: "About The Course",
      href: "/about-course",
      icon: <BookOpen className="h-8 w-8 mb-3 text-primary" />,
      description:
        "Explore details of the B.Sc. Applied AI & DS program at IIT Jodhpur.",
      image: <GraduationCap className="h-16 w-16 text-blue-500" />,
    },
    {
      title: "Our Community",
      href: "/about",
      icon: <Users className="h-8 w-8 mb-3 text-primary" />,
      description:
        "Learn about BScAI Unity, our mission, and our student-led approach.",
      image: <Users className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Concern Statistics",
      href: "/status-board",
      icon: <BarChart3 className="h-8 w-8 mb-3 text-primary" />,
      description:
        "View current statistics on concern submissions and resolutions.",
      image: <TrendingUp className="h-16 w-16 text-purple-500" />,
    },
  ];

  const features = [
    {
      title: "Submit Concerns",
      description:
        "Easily submit your academic and administrative concerns through our streamlined platform.",
      icon: <MessageSquare className="h-12 w-12 text-blue-500" />,
      image: <MessageSquare className="h-16 w-16 text-blue-500" />,
    },
    {
      title: "Track Progress",
      description:
        "Monitor the status of your concerns and see real-time updates on resolutions.",
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      image: <CheckCircle className="h-16 w-16 text-green-500" />,
    },
    {
      title: "Quick Resolution",
      description:
        "Our admin team ensures rapid response times and efficient concern resolution.",
      icon: <Clock className="h-12 w-12 text-orange-500" />,
      image: <Zap className="h-16 w-16 text-orange-500" />,
    },
    {
      title: "Academic Excellence",
      description:
        "Focus on your studies while we handle the administrative challenges for you.",
      icon: <GraduationCap className="h-12 w-12 text-purple-500" />,
      image: <Target className="h-16 w-16 text-purple-500" />,
    },
  ];

  const achievements = [];

  const programBrief =
    "IIT Jodhpur's B.Sc./BS in Applied AI and Data Science is a pioneering fully online degree, offered in collaboration with Futurense Uni. It features a flexible, stackable 4-year model, an industry-focused curriculum, and does not require JEE for admission—only 60% in 12th (Maths) and a qualifying test. Annual fee: ₹1,09,000 + application fee.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Advanced Features Showcase */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 px-6 py-2 rounded-full border border-purple-300/30 mb-6">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Advanced Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Revolutionary Learning
              </span>
              <br />
              <span className="text-foreground">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover cutting-edge tools and features designed specifically for the future of AI education
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src="https://r2cdn.perplexity.ai/academic/student-referrals.jpg"
                  alt="AI-Powered Learning"
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-3xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-6 w-6" />
                    <span className="font-semibold">AI-Powered Research</span>
                  </div>
                  <p className="text-sm opacity-90">Unlock unlimited potential with advanced AI tools</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {[
                {
                  icon: <Zap className="h-8 w-8 text-yellow-500" />,
                  title: "Lightning Fast Performance",
                  description: "Experience blazing-fast response times with our optimized platform architecture",
                  stats: "99.9% Uptime"
                },
                {
                  icon: <Shield className="h-8 w-8 text-green-500" />,
                  title: "Enterprise Security",
                  description: "Your data is protected with bank-level security and encryption protocols",
                  stats: "256-bit Encryption"
                },
                {
                  icon: <Users className="h-8 w-8 text-blue-500" />,
                  title: "Collaborative Learning",
                  description: "Connect with peers, share knowledge, and grow together in our community",
                  stats: "1000+ Active Users"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-purple-200/30 hover:border-purple-300/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-2">{feature.description}</p>
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400">
                      <CheckCircle className="h-4 w-4" />
                      {feature.stats}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Advanced Features Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Link to="/perplexity-promo" className="block">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-1 rounded-3xl cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 px-4 py-2 rounded-full border border-purple-300/30 mb-6">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Advanced Platform Features
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                      Experience the Future of Education
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Revolutionary tools and features designed to accelerate your learning journey
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: <Rocket className="h-12 w-12 text-blue-500" />,
                        title: "AI-Powered Insights",
                        description: "Get personalized learning recommendations powered by advanced AI algorithms",
                        image: <Brain className="h-16 w-16 text-blue-500" />
                      },
                      {
                        icon: <Target className="h-12 w-12 text-green-500" />,
                        title: "Smart Progress Tracking",
                        description: "Track your academic progress with intelligent analytics and milestone tracking",
                        image: <TrendingUp className="h-16 w-16 text-green-500" />
                      },
                      {
                        icon: <Globe className="h-12 w-12 text-purple-500" />,
                        title: "Global Community",
                        description: "Connect with students worldwide and collaborate on cutting-edge AI projects",
                        image: <Globe className="h-16 w-16 text-purple-500" />
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center group"
                      >
                        <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                          {feature.image}
                        </div>
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

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
                className="text-center"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3
                  className={`text-sm md:text-base font-semibold ${achievement.color}`}
                >
                  {achievement.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-background">
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
              We provide a comprehensive platform to address your academic
              concerns and build a stronger community together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group">
                  <CardContent className="space-y-4">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.image}
                    </div>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
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
            Latest Concerns
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay updated with the most recent issues, discussions, and
            resolutions within our pioneering batch. Your voice contributes to
            our collective progress.
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
              <div className="mb-4">
                <Rocket className="h-16 w-16 mx-auto text-primary/70" />
              </div>
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

      {/* Program Overview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-16 shadow-xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10 border-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-50"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl md:text-3xl gradient-text text-center flex items-center justify-center gap-3">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <Lightbulb className="inline-block h-7 w-7" />
                  Quick Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-center text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
                  {programBrief}
                </p>
                <div className="text-center">
                  <Button
                    asChild
                    variant="default"
                    className="text-primary-foreground group hover:scale-105 transition-transform"
                  >
                    <Link to="/about-course">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Discover Full Program Details
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
                <Card className="h-full bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-border hover:border-primary/40 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {link.image}
                  </div>
                  <div className="group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {link.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 mt-1 relative z-10">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow relative z-10">
                    {link.description}
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="text-primary group hover:underline relative z-10"
                  >
                    <Link to={link.href}>
                      Learn More{" "}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
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
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <Star className="h-16 w-16 mx-auto text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of proactive students working together to
              improve our academic experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary group"
              >
                <Link to="/add-concern">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Submit a Concern
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/concerns">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Browse Concerns
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;

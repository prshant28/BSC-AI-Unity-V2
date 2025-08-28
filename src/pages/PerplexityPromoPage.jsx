import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Lock,
  Download,
  ExternalLink,
  Clock,
  Zap,
  Shield,
  Sparkles,
  Calendar,
  Users,
  CheckCircle,
  Trophy,
  Rocket,
  Brain,
  Infinity,
  Target,
  Globe,
  Award,
  Crown,
  Gift,
  Timer,
  TrendingUp,
  BookOpen,
  Flame,
} from "lucide-react";

const PerplexityPromoPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Countdown to September 2, 2025
  useEffect(() => {
    const targetDate = new Date("2025-09-02T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLaunched = new Date() >= new Date("2025-09-02T00:00:00");

  const features = [
    {
      icon: <Infinity className="h-8 w-8 text-blue-400" />,
      title: "Unlimited AI Searches",
      description:
        "No daily limits, search as much as you need for your research and studies",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "Advanced Reasoning",
      description:
        "Access to GPT-4, Claude, and other cutting-edge AI models for complex queries",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-400" />,
      title: "Real-time Information",
      description:
        "Get the latest information with real-time web search capabilities",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-400" />,
      title: "Academic Sources",
      description:
        "Access to scholarly articles, research papers, and academic databases",
    },
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: "Precise Citations",
      description:
        "Automatically generated citations for your research and papers",
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-400" />,
      title: "Ad-free Experience",
      description: "Clean, distraction-free interface for focused learning",
    },
  ];

  const browserFeatures = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "AI-Powered Browsing",
      description: "Smart suggestions and contextual assistance while browsing",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Built-in Study Tools",
      description:
        "Note-taking, highlighting, and research organization features",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enhanced Privacy",
      description: "Advanced privacy protection for secure academic research",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Student-Focused",
      description: "Designed specifically for academic workflows and learning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
            <motion.img
              src="https://media.discordapp.net/attachments/1403200172187586671/1407283917953830992/campus_strategists_linkedin-22.png?ex=68b016c8&is=68aec548&hm=4886b70dd19435c3c569f4276b1bc807ed9e9fad8633730b4c419be75057d12a&=&format=webp&quality=lossless&width=853&height=445"
              alt="Campus Partner Promotion"
              className="mx-auto max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full h-auto rounded-xl md:rounded-3xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-lg">
            <Crown className="mr-2 h-5 w-5" />
            Exclusive Early Access Program
          </Badge>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 px-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Supercharge Your Learning with{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Perplexity AI Pro
            </span>
          </motion.h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
            I'm officially selected as a Perplexity AI Campus Partner! Claim
            your free pro plan access. Just use your student email ID to get
            started. Also, get exclusive early access to the revolutionary
            AI-powered Comet Browser!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">
                1M+
              </div>
              <div className="text-blue-200 text-xs md:text-sm">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">
                4.9★
              </div>
              <div className="text-blue-200 text-xs md:text-sm">
                User Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">
                50%
              </div>
              <div className="text-blue-200 text-xs md:text-sm">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">
                24/7
              </div>
              <div className="text-blue-200 text-xs md:text-sm">
                Availability
              </div>
            </div>
          </div>
        </motion.div>

        {/* Countdown Timer - Enhanced */}
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-black/40 backdrop-blur-md border-purple-500/30 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2 text-2xl">
                  <Clock className="h-8 w-8 text-purple-400" />
                  🚀 Comet Browser Launch Countdown
                </CardTitle>
                <p className="text-center text-blue-200">
                  Be among the first to experience the future of AI-powered
                  browsing!
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6 text-center">
                  {[
                    {
                      value: timeLeft.days,
                      label: "Days",
                      color: "from-purple-600 to-purple-800",
                    },
                    {
                      value: timeLeft.hours,
                      label: "Hours",
                      color: "from-blue-600 to-blue-800",
                    },
                    {
                      value: timeLeft.minutes,
                      label: "Minutes",
                      color: "from-indigo-600 to-indigo-800",
                    },
                    {
                      value: timeLeft.seconds,
                      label: "Seconds",
                      color: "from-pink-600 to-pink-800",
                    },
                  ].map(({ value, label, color }) => (
                    <motion.div
                      key={label}
                      className={`bg-gradient-to-b ${color} rounded-xl p-6 shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="text-4xl font-bold text-white"
                        key={value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {value}
                      </motion.div>
                      <div className="text-blue-200 text-sm font-medium">
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Grid - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose Perplexity AI Pro?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Unlock the full potential of AI-powered research and learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 h-full hover:border-purple-400/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-blue-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comet Browser Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-black/30 backdrop-blur-md border-blue-500/30 max-w-6xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Rocket className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-white text-3xl">
                  Meet Comet Browser
                </CardTitle>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-blue-100 text-lg">
                The world's first AI-native browser designed for students
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {browserFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-purple-500/30 max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't miss out on this exclusive opportunity. Grab your free pro
              plan now and start leveraging the power of AI!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                    "0 0 40px rgba(236, 72, 153, 0.3)",
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="rounded-xl"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-2xl relative overflow-hidden group"
                >
                  <a
                    href="https://plex.it/referrals/CZ8FRX5B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 relative z-10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Gift className="h-6 w-6" />
                    </motion.div>
                    Claim Your Free Pro Plan!
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700"></div>
                  </a>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgb(96, 165, 250)",
                  boxShadow: "0 0 30px rgba(96, 165, 250, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg relative overflow-hidden group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Lock className="h-6 w-6 mr-3" />
                    Download Comet Browser
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700"></div>
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-blue-200">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: "rgb(34, 197, 94)" }}
              >
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Use your student email ID</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: "rgb(96, 165, 250)" }}
              >
                <Users className="h-5 w-5 text-blue-400" />
                <span>Join the first cohort</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: "rgb(236, 72, 153)" }}
              >
                <Sparkles className="h-5 w-5 text-pink-400" />
                <span>Interactive marketing</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Launch Date Notice */}
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl p-8 max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 text-yellow-200 mb-4">
                <Calendar className="h-6 w-6" />
                <span className="font-bold text-xl">Mark Your Calendar!</span>
              </div>
              <p className="text-yellow-100 text-lg leading-relaxed">
                Comet Browser will be available for download on{" "}
                <span className="font-bold text-yellow-300">
                  September 2, 2025
                </span>
                . Be ready to experience the future of AI-powered browsing!
              </p>
            </div>
          </motion.div>
        )}

        {/* Important Notice - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-3 text-2xl">
                <Flame className="h-8 w-8 text-orange-400" />
                🚨 Important Notice - Limited Time Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl mb-6">🎓</div>
              <p className="text-orange-100 text-lg leading-relaxed mb-6">
                As a Perplexity AI Campus Partner, I'm bringing you this
                exclusive offer to get free access to Perplexity AI Pro. This is
                a limited-time opportunity to experience cutting-edge AI tools
                that can significantly accelerate your learning and research.
                Contact me now at info@bscaiunity.space for more details.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="flex items-center gap-3 text-orange-100">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span>Official Campus Partner Offer</span>
                </div>
                <div className="flex items-center gap-3 text-orange-100">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  <span>Free Pro Plan</span>
                </div>
                <div className="flex items-center gap-3 text-orange-100">
                  <Award className="h-6 w-6 text-purple-400" />
                  <span>Claim with your student email</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PerplexityPromoPage;
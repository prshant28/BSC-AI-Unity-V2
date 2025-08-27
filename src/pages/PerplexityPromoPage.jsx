
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
} from 'lucide-react';

const PerplexityPromoPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown to September 2, 2025
  useEffect(() => {
    const targetDate = new Date('2025-09-02T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isLaunched = new Date() >= new Date('2025-09-02T00:00:00');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <img 
              src="/attached_assets/image_1756284467105.png" 
              alt="Campus Partner Promotion" 
              className="mx-auto max-w-2xl w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
          
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Exclusive Early Access
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Get <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Perplexity AI Pro</span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Want to access the most advanced AI search engine? Get Perplexity AI Pro subscription 
            and discover the revolutionary AI-powered Comet Browser - available exclusively for our students!
          </p>
        </motion.div>

        {/* Countdown Timer */}
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6 text-purple-400" />
                  Comet Browser Launch Countdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                    <div className="text-purple-200 text-sm">Days</div>
                  </div>
                  <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                    <div className="text-blue-200 text-sm">Hours</div>
                  </div>
                  <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                    <div className="text-indigo-200 text-sm">Minutes</div>
                  </div>
                  <div className="bg-gradient-to-b from-pink-600 to-pink-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                    <div className="text-pink-200 text-sm">Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <Card className="bg-black/30 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                Perplexity AI Pro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-100 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Unlimited AI searches
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Advanced reasoning models
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Real-time information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Academic research tools
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                Comet Browser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-100 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  AI-powered browsing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Built-in study tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Enhanced privacy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Student-focused features
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-md border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-pink-400" />
                Early Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-100 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Exclusive beta access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Special student pricing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Lifetime benefits
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              asChild
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <a 
                href="https://plex.it/referrals/CZ8FRX5B" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Star className="h-5 w-5" />
                Get Perplexity AI Pro
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              disabled={!isLaunched}
              className={`w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white ${
                !isLaunched ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!isLaunched ? (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Download Comet Browser
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download Now
                </>
              )}
            </Button>
          </div>

          {!isLaunched && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-yellow-200">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  Comet Browser will be available for download on September 2, 2025
                </span>
              </div>
            </div>
          )}

          <p className="text-blue-100 text-sm max-w-2xl mx-auto">
            This exclusive offer is currently available only for Max plan subscribers, but we're providing 
            early access to our dedicated students. Be among the first to experience the future of AI-powered browsing!
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-400" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-orange-100 text-lg leading-relaxed">
                This is an advanced marketing campaign to promote AI-powered tools for educational purposes. 
                By participating, you gain access to premium AI tools that can significantly enhance your learning experience. 
                Take advantage of this limited-time opportunity to be at the forefront of AI-assisted education!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PerplexityPromoPage;

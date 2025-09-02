
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Star, 
  Trophy, 
  Award, 
  Rocket,
  ArrowLeft
} from 'lucide-react';

const StudentAchievementsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6 min-h-screen flex items-center justify-center"
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl mb-8">🚧</div>
          
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Coming Soon!
              </CardTitle>
              <div className="flex justify-center items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold text-primary">Student Achievements</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We're working hard to bring you an amazing achievement system! Track your progress, 
                earn badges, and compete with fellow students in our upcoming achievements portal.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Trophies</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Badges</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Rankings</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Rocket className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">Progress</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">What's Coming:</h3>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>• Personal achievement dashboard</li>
                  <li>• Quiz completion badges</li>
                  <li>• Community participation rewards</li>
                  <li>• Leaderboards and rankings</li>
                  <li>• Progress tracking and analytics</li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Button asChild size="lg" className="group">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentAchievementsPage;

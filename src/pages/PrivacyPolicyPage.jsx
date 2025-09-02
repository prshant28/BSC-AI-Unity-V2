
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, ExternalLink } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">
            Privacy Policy
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your privacy and data protection information
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">
              Official IIT Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              For official privacy policies related to the B.Sc. Applied AI & Data Science program, 
              please refer to the official IIT Jodhpur privacy policy.
            </p>
            <Button asChild className="group">
              <a 
                href="https://www.iitj.ac.in/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View IIT Jodhpur Privacy Policy
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Platform Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                Important Notice
              </h3>
              <p className="text-orange-700 dark:text-orange-300">
                This platform is <strong>not an official platform</strong> and does not claim 
                anything about the B.Sc. Applied AI & Data Science program. All details are 
                collected from available public data and published on this platform for 
                educational and informational purposes only.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">About BSc AI Unity</h3>
              <p className="text-muted-foreground mb-4">
                BSc AI Unity is a student-led initiative created to support fellow students 
                in the B.Sc. Applied AI & Data Science program. We provide tools, resources, 
                and a platform for community interaction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We collect minimal data necessary for platform functionality</li>
                <li>User-submitted concerns and feedback for platform improvement</li>
                <li>Basic usage analytics to enhance user experience</li>
                <li>No personal academic records or sensitive information is stored</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Data Usage</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Data is used solely for platform functionality and improvement</li>
                <li>We do not share personal information with third parties</li>
                <li>Anonymous analytics may be used for platform optimization</li>
                <li>User concerns are handled with confidentiality</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Contact</h3>
              <p className="text-muted-foreground">
                For any privacy-related questions or concerns, please contact us at{' '}
                <a href="mailto:info@bscaiunity.space" className="text-primary hover:underline">
                  info@bscaiunity.space
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="group">
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;

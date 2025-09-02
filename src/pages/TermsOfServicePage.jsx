
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ExternalLink } from 'lucide-react';

const TermsOfServicePage = () => {
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">
            Terms of Service
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Terms and conditions for using BSc AI Unity platform
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/30 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-2xl text-red-800 dark:text-red-200">
              Important Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-700 dark:text-red-300">
                <strong>This content is provided by BSc AI Unity.</strong> We are not affiliated 
                with or endorsed by IIT Jodhpur. This is an unofficial platform created by students 
                for students.
              </p>
              <p className="text-red-700 dark:text-red-300">
                All content is original work of BSc AI Unity and cannot be claimed for copyright 
                by any other entity. All content is provided for educational purposes only.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Platform Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using BSc AI Unity platform, you accept and agree to be bound 
                by these terms and conditions. If you do not agree to these terms, please do not 
                use our platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">2. Platform Purpose</h3>
              <p className="text-muted-foreground">
                BSc AI Unity is a student-led initiative designed to support students in the 
                B.Sc. Applied AI & Data Science program through tools, resources, and community features.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. User Responsibilities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the platform for educational and academic purposes only</li>
                <li>Respect other users and maintain a positive community environment</li>
                <li>Do not share false, misleading, or harmful content</li>
                <li>Respect intellectual property rights</li>
                <li>Do not attempt to compromise platform security</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">4. Content Guidelines</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>All user-generated content must be appropriate and relevant</li>
                <li>No offensive, discriminatory, or harmful content</li>
                <li>Respect privacy and confidentiality of fellow students</li>
                <li>Academic integrity must be maintained at all times</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">5. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                BSc AI Unity provides this platform "as is" without warranties. We are not 
                responsible for any academic decisions made based on information from this platform. 
                Always verify important academic information through official channels.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">6. Privacy</h3>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">7. Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be posted 
                on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">8. Contact Information</h3>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:info@bscaiunity.space" className="text-primary hover:underline">
                  info@bscaiunity.space
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-900/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              © BSc AI Unity | All Rights Reserved 2025
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: January 2025
            </p>
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

export default TermsOfServicePage;


import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const AdminPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-16 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Settings className="h-8 w-8" />
              Admin Panel Moved
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              The admin panel has been moved to the main admin dashboard for better organization.
            </p>
            <p className="text-muted-foreground">
              You can now manage notices, events, and all other content from the unified admin dashboard.
            </p>
            <Button asChild size="lg" className="w-full">
              <a href="/admin/dashboard/content">
                <ArrowRight className="w-5 h-5 mr-2" />
                Go to Admin Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;

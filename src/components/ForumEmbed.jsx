
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink, Expand, Minimize, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { checkAdminAuth } from './AdminPanel';

const ForumEmbed = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdmin] = useState(checkAdminAuth());
  const forumUrl = import.meta.env.VITE_FORUM_URL || "https://bscaiunity.discourse.group";

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`container mx-auto py-8 px-4 ${isExpanded ? 'fixed inset-0 z-50 bg-background' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isExpanded ? 'h-full flex flex-col' : ''}`}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text heading-font">
            Community Forum
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto body-font">
            Connect, discuss, and collaborate with your fellow BSc AI students
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={isExpanded ? 'flex-1' : ''}
        >
          <Card className={isExpanded ? 'h-full' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 heading-font">
                  <MessageCircle className="h-6 w-6" />
                  BSc AI Unity Forum
                </CardTitle>
                
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button asChild variant="outline" size="sm">
                      <a href="/admin-panel" className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </a>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <Minimize className="w-4 h-4 mr-1" />
                        Minimize
                      </>
                    ) : (
                      <>
                        <Expand className="w-4 h-4 mr-1" />
                        Expand
                      </>
                    )}
                  </Button>
                  
                  <Button asChild variant="outline" size="sm">
                    <a 
                      href={forumUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className={`p-0 ${isExpanded ? 'flex-1' : ''}`}>
              <iframe
                src={forumUrl}
                className={`w-full border-0 rounded-b-lg ${
                  isExpanded ? 'h-full min-h-[calc(100vh-200px)]' : 'h-[600px]'
                }`}
                title="BSc AI Unity Forum"
                loading="lazy"
                allow="encrypted-media; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Info */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2 heading-font">Discussions</h3>
                <p className="text-sm text-muted-foreground body-font">
                  Engage in meaningful conversations about coursework and career prospects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2 heading-font">Community</h3>
                <p className="text-sm text-muted-foreground body-font">
                  Connect with classmates and build lasting professional relationships
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ExternalLink className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2 heading-font">Resources</h3>
                <p className="text-sm text-muted-foreground body-font">
                  Share study materials, job opportunities, and helpful resources
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForumEmbed;

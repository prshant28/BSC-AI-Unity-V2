
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MessageSquare, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FORUM_URL = import.meta.env.VITE_FORUM_URL || 'https://bscaiunity.discourse.group';

const ForumEmbed = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Try to load iframe first, fallback to API if it fails
    const timer = setTimeout(() => {
      if (!iframeLoaded && !iframeError) {
        setIframeError(true);
        loadForumData();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
    loadForumData();
  };

  const loadForumData = async () => {
    setLoading(true);
    try {
      // Try direct fetch first
      const topicsResponse = await fetch(`${FORUM_URL}/latest.json`);
      const categoriesResponse = await fetch(`${FORUM_URL}/categories.json`);
      
      if (topicsResponse.ok && categoriesResponse.ok) {
        const topicsData = await topicsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setTopics(topicsData.topic_list?.topics || []);
        setCategories(categoriesData.category_list?.categories || []);
      } else {
        // If direct fetch fails, show sample data
        setSampleData();
      }
    } catch (error) {
      console.error('Failed to fetch forum data:', error);
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    setTopics([
      {
        id: 1,
        title: 'Welcome to BSc AI Unity Community',
        posts_count: 12,
        reply_count: 8,
        last_posted_at: new Date().toISOString(),
        posters: [{ description: 'Original Poster' }]
      },
      {
        id: 2,
        title: 'Semester 1 Study Group',
        posts_count: 25,
        reply_count: 20,
        last_posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        posters: [{ description: 'Original Poster' }]
      },
      {
        id: 3,
        title: 'AI Project Showcase',
        posts_count: 18,
        reply_count: 15,
        last_posted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        posters: [{ description: 'Original Poster' }]
      }
    ]);
    
    setCategories([
      { id: 1, name: 'General', topic_count: 10 },
      { id: 2, name: 'Academic', topic_count: 8 },
      { id: 3, name: 'Projects', topic_count: 5 }
    ]);
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category_id?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
          Community Forum
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Connect with fellow BSc AI students, share knowledge, and build our community together
        </p>
      </motion.div>

      {!iframeError ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl shadow-lg overflow-hidden"
        >
          <iframe
            src={FORUM_URL}
            title="Community Forum"
            className="w-full h-[80vh] border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Forum access card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                      BSc AI Unity Forum
                    </h2>
                    <p className="text-blue-600 dark:text-blue-300">
                      Join discussions with your fellow students
                    </p>
                  </div>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href={FORUM_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Forum
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Topics preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Latest Discussions
              </CardTitle>
              
              {/* Search and filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTopics.map(topic => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => window.open(`${FORUM_URL}/t/${topic.id}`, '_blank', 'noopener,noreferrer')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 hover:text-primary">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {topic.reply_count || 0} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(topic.last_posted_at)}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredTopics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No topics found matching your search.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForumEmbed;

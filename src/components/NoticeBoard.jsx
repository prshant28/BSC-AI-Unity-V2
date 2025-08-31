
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { 
  Pin, 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { noticesAPI } from '../lib/storage';
import { useToast } from './ui/use-toast';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedNotices, setExpandedNotices] = useState(new Set());
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const { toast } = useToast();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await noticesAPI.getAll();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
      toast({
        title: "Error",
        description: "Failed to load notices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    
    if (!end || start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString('en-GB', formatOptions)}`;
    }
    
    return `${start.toLocaleDateString('en-GB', formatOptions)} - ${end.toLocaleDateString('en-GB', formatOptions)}`;
  };

  const isNoticeActive = (notice) => {
    const now = new Date();
    const start = new Date(notice.start_date);
    const end = notice.end_date ? new Date(notice.end_date) : new Date(notice.start_date);
    
    // Set time to start of day for comparison
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return now >= start && now <= end;
  };

  const getAllTags = () => {
    const tagSet = new Set();
    notices.forEach(notice => {
      notice.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredNotices = notices.filter(notice => {
    // Search filter
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => notice.tags.includes(tag));
    
    // Date filter
    let matchesDate = true;
    if (dateFilter === 'active') {
      matchesDate = isNoticeActive(notice);
    } else if (dateFilter === 'archived') {
      matchesDate = !isNoticeActive(notice);
    } else if (dateFilter === 'thisWeek') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(notice.start_date) >= weekAgo;
    } else if (dateFilter === 'thisMonth') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(notice.start_date) >= monthAgo;
    }
    
    return matchesSearch && matchesTags && matchesDate;
  });

  // Sort notices: pinned first, then by start_date desc, then by created_at desc
  const sortedNotices = filteredNotices.sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return b.pinned - a.pinned; // Pinned first
    }
    
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateB - dateA; // Newer start_date first
    }
    
    return new Date(b.created_at) - new Date(a.created_at); // Newer created_at first
  });

  const toggleExpanded = (noticeId) => {
    const newExpanded = new Set(expandedNotices);
    if (newExpanded.has(noticeId)) {
      newExpanded.delete(noticeId);
    } else {
      newExpanded.add(noticeId);
    }
    setExpandedNotices(newExpanded);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderMarkdown = (markdown) => {
    return { __html: marked(markdown) };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          Notice Board
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Stay updated with the latest announcements and important information
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-4"
      >
        <Card className="hover-card" style={{ background: '#f35c7e', color: 'white' }}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/70"
                />
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/30 bg-white/10 text-white"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <option value="all" style={{ color: 'black' }}>All Notices</option>
                <option value="active" style={{ color: 'black' }}>Active</option>
                <option value="archived" style={{ color: 'black' }}>Archived</option>
                <option value="thisWeek" style={{ color: 'black' }}>This Week</option>
                <option value="thisMonth" style={{ color: 'black' }}>This Month</option>
              </select>

              {/* Admin Link */}
              {isAdmin ? (
                <Button asChild className="bg-white text-[#f35c7e] hover:bg-white/90">
                  <a href="/admin">
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Notices
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <a href="/admin">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Login
                  </a>
                </Button>
              )}
            </div>

            {/* Tag Filters */}
            {getAllTags().length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {getAllTags().map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {sortedNotices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No notices found</p>
                <p>Try adjusting your filters or check back later for updates.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedNotices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover-card ${notice.pinned ? 'notice-pinned' : ''} ${
                isNoticeActive(notice) ? 'notice-active' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.pinned && (
                          <Pin className="h-4 w-4 text-yellow-600 fill-current" />
                        )}
                        <CardTitle className="text-xl">{notice.title}</CardTitle>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(notice.start_date, notice.end_date)}
                        </span>
                        {isNoticeActive(notice) && (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            Active
                          </Badge>
                        )}
                      </div>

                      {notice.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {notice.tags.map(tag => (
                            <Badge key={tag} variant="secondary">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {expandedNotices.has(notice.id) ? (
                      <div dangerouslySetInnerHTML={renderMarkdown(notice.body)} />
                    ) : (
                      <div dangerouslySetInnerHTML={renderMarkdown(truncateText(notice.body))} />
                    )}
                  </div>

                  {notice.body.length > 200 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(notice.id)}
                      className="mt-4"
                    >
                      {expandedNotices.has(notice.id) ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Read More
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default NoticeBoard;

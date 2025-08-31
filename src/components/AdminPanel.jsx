
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  FileText, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Pin, 
  PinOff,
  Tag,
  Clock,
  Save,
  X,
  Users,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Activity,
  RefreshCw,
  Grid,
  List,
  Eye,
  MapPin,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { noticesAPI, eventsAPI } from '../lib/storage';
import { useToast } from './ui/use-toast';
import { supabase } from '../lib/supabaseClient';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventViewMode, setEventViewMode] = useState('grid');
  const { toast } = useToast();

  const [dashboardStats, setDashboardStats] = useState({
    totalConcerns: 0,
    resolvedConcerns: 0,
    pendingConcerns: 0,
    inProgressConcerns: 0,
    recentActivity: 0,
    responseRate: 0
  });

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    body: '',
    tags: [],
    start_date: '',
    end_date: '',
    pinned: false
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    category: 'General',
    location: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Check if user is already authenticated from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    toast({
      title: "Success",
      description: "Admin access granted"
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "Admin session ended"
    });
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load notices and events
      const [noticesData, eventsData] = await Promise.all([
        noticesAPI.getAll(),
        eventsAPI.getAll()
      ]);
      setNotices(noticesData);
      setEvents(eventsData);

      // Load concerns from Supabase
      const { data: concernsData, error: concernsError } = await supabase
        .from('concerns')
        .select('*')
        .order('created_at', { ascending: false });

      if (concernsError) throw concernsError;
      setConcerns(concernsData || []);

      // Load leaderboard from Supabase
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('quiz_responses')
        .select(`
          id,
          student_name,
          student_email,
          score,
          total_questions,
          quiz_id,
          subject_id,
          submitted_at
        `)
        .order('score', { ascending: false });

      if (leaderboardError) throw leaderboardError;
      setLeaderboard(leaderboardData || []);

      // Calculate dashboard stats
      const total = concernsData?.length || 0;
      const resolved = concernsData?.filter(c => c.status?.toLowerCase() === 'resolved').length || 0;
      const pending = concernsData?.filter(c => c.status?.toLowerCase() === 'pending').length || 0;
      const inProgress = concernsData?.filter(c => c.status?.toLowerCase() === 'in progress').length || 0;
      const recentActivity = concernsData?.filter(c => {
        const createdAt = new Date(c.created_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return createdAt > dayAgo;
      }).length || 0;

      setDashboardStats({
        totalConcerns: total,
        resolvedConcerns: resolved,
        pendingConcerns: pending,
        inProgressConcerns: inProgress,
        recentActivity,
        responseRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      });

    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetNoticeForm = () => {
    setNoticeForm({
      title: '',
      body: '',
      tags: [],
      start_date: '',
      end_date: '',
      pinned: false
    });
    setTagInput('');
    setSelectedNotice(null);
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      start: '',
      end: '',
      category: 'General',
      location: ''
    });
    setSelectedEvent(null);
  };

  const openCreateNoticeModal = () => {
    resetNoticeForm();
    setNoticeForm(prev => ({
      ...prev,
      start_date: new Date().toISOString().split('T')[0]
    }));
    setShowNoticeModal(true);
  };

  const openEditNoticeModal = (notice) => {
    setSelectedNotice(notice);
    setNoticeForm({
      title: notice.title,
      body: notice.body,
      tags: notice.tags || [],
      start_date: notice.start_date,
      end_date: notice.end_date || '',
      pinned: notice.pinned
    });
    setShowNoticeModal(true);
  };

  const openCreateEventModal = () => {
    resetEventForm();
    setShowEventModal(true);
  };

  const openEditEventModal = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      start: event.start,
      end: event.end || '',
      category: event.category || 'General',
      location: event.location || ''
    });
    setShowEventModal(true);
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedNotice) {
        await noticesAPI.update(selectedNotice.id, noticeForm);
        toast({
          title: "Success",
          description: "Notice updated successfully"
        });
      } else {
        await noticesAPI.create(noticeForm);
        toast({
          title: "Success",
          description: "Notice created successfully"
        });
      }
      
      await loadAllData();
      setShowNoticeModal(false);
      resetNoticeForm();
    } catch (error) {
      console.error('Failed to save notice:', error);
      toast({
        title: "Error",
        description: "Failed to save notice",
        variant: "destructive"
      });
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...eventForm,
        id: selectedEvent?.id || `event-${Date.now()}`
      };

      if (selectedEvent) {
        await eventsAPI.update(selectedEvent.id, eventData);
        toast({
          title: "Success",
          description: "Event updated successfully"
        });
      } else {
        await eventsAPI.create(eventData);
        toast({
          title: "Success",
          description: "Event created successfully"
        });
      }
      
      await loadAllData();
      setShowEventModal(false);
      resetEventForm();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      });
    }
  };

  const handleNoticeDelete = async (noticeId) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      await noticesAPI.delete(noticeId);
      await loadAllData();
      toast({
        title: "Success",
        description: "Notice deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete notice:', error);
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive"
      });
    }
  };

  const handleEventDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.delete(eventId);
      await loadAllData();
      toast({
        title: "Success",
        description: "Event deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const toggleNoticePinned = async (notice) => {
    try {
      await noticesAPI.update(notice.id, { pinned: !notice.pinned });
      await loadAllData();
      toast({
        title: "Success",
        description: `Notice ${notice.pinned ? 'unpinned' : 'pinned'} successfully`
      });
    } catch (error) {
      console.error('Failed to toggle pinned status:', error);
      toast({
        title: "Error",
        description: "Failed to update notice",
        variant: "destructive"
      });
    }
  };

  const updateConcernStatus = async (concernId, newStatus) => {
    try {
      const { error } = await supabase
        .from('concerns')
        .update({ status: newStatus })
        .eq('id', concernId);

      if (error) throw error;

      await loadAllData();
      toast({
        title: "Success",
        description: "Concern status updated successfully"
      });
    } catch (error) {
      console.error('Failed to update concern status:', error);
      toast({
        title: "Error",
        description: "Failed to update concern status",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !noticeForm.tags.includes(tagInput.trim())) {
      setNoticeForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNoticeForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "primary" }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-16 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Settings className="h-6 w-6" />
                Admin Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-muted-foreground">
                Please login through the main admin login page to access the admin panel.
              </p>
              <Button asChild>
                <a href="/admin-login">Go to Admin Login</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text heading-font">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto body-font">
          Comprehensive management panel for BSc AI Unity platform
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('dashboard')}
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'concerns' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('concerns')}
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Concerns ({concerns.length})
                </Button>
                <Button
                  variant={activeTab === 'notices' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('notices')}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Notices ({notices.length})
                </Button>
                <Button
                  variant={activeTab === 'events' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('events')}
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events ({events.length})
                </Button>
                <Button
                  variant={activeTab === 'leaderboard' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('leaderboard')}
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={loadAllData} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Concerns"
              value={dashboardStats.totalConcerns}
              icon={MessageSquare}
            />
            <StatCard
              title="Resolved"
              value={dashboardStats.resolvedConcerns}
              icon={CheckCircle}
            />
            <StatCard
              title="In Progress"
              value={dashboardStats.inProgressConcerns}
              icon={Clock}
            />
            <StatCard
              title="Recent Activity (24h)"
              value={dashboardStats.recentActivity}
              icon={Activity}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={openCreateNoticeModal} className="h-20 flex-col">
                  <Plus className="w-6 h-6 mb-2" />
                  Add Notice
                </Button>
                <Button onClick={openCreateEventModal} className="h-20 flex-col">
                  <Calendar className="w-6 h-6 mb-2" />
                  Add Event
                </Button>
                <Button onClick={() => setActiveTab('concerns')} variant="outline" className="h-20 flex-col">
                  <MessageSquare className="w-6 h-6 mb-2" />
                  View Concerns
                </Button>
                <Button onClick={() => setActiveTab('leaderboard')} variant="outline" className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Concerns</CardTitle>
                <CardDescription>Latest submissions requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {concerns.slice(0, 5).map((concern) => (
                    <div key={concern.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{concern.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          By {concern.student_name || 'Anonymous'}
                        </p>
                      </div>
                      <Badge variant={concern.status?.toLowerCase() === 'resolved' ? 'default' : 'secondary'}>
                        {concern.status || 'Pending'}
                      </Badge>
                    </div>
                  ))}
                  {concerns.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No concerns yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Upcoming and recent events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.start).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>{event.category || 'General'}</Badge>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No events yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Concerns Tab */}
      {activeTab === 'concerns' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {concerns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No concerns yet</p>
                <p className="text-muted-foreground">Student concerns will appear here when submitted</p>
              </CardContent>
            </Card>
          ) : (
            concerns.map(concern => (
              <Card key={concern.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{concern.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>By: {concern.student_name || 'Anonymous'}</span>
                        <span>Category: {concern.category}</span>
                        <span>{new Date(concern.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={concern.status || 'Pending'}
                        onChange={(e) => updateConcernStatus(concern.id, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{concern.description}</p>
                  {concern.student_email && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Contact: {concern.student_email}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </motion.div>
      )}

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold heading-font">Notices Management</h2>
            <Button onClick={openCreateNoticeModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Notice
            </Button>
          </div>

          {notices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No notices yet</p>
                <Button onClick={openCreateNoticeModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Notice
                </Button>
              </CardContent>
            </Card>
          ) : (
            notices
              .sort((a, b) => {
                if (a.pinned !== b.pinned) return b.pinned - a.pinned;
                return new Date(b.created_at) - new Date(a.created_at);
              })
              .map(notice => (
                <Card key={notice.id} className={notice.pinned ? 'ring-2 ring-yellow-400' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {notice.pinned && (
                            <Pin className="h-4 w-4 text-yellow-600 fill-current" />
                          )}
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(notice.start_date).toLocaleDateString()} 
                            {notice.end_date && ` - ${new Date(notice.end_date).toLocaleDateString()}`}
                          </span>
                        </div>
                        {notice.tags?.length > 0 && (
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleNoticePinned(notice)}
                        >
                          {notice.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditNoticeModal(notice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleNoticeDelete(notice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {notice.body.substring(0, 200)}
                      {notice.body.length > 200 && '...'}
                    </p>
                  </CardContent>
                </Card>
              ))
          )}
        </motion.div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold heading-font">Events Management</h2>
            <div className="flex gap-2">
              <Button
                variant={eventViewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setEventViewMode('grid')}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={eventViewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setEventViewMode('list')}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button onClick={openCreateEventModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No events yet</p>
                <Button onClick={openCreateEventModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={eventViewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {events.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Clock className="h-3 w-3" />
                          {new Date(event.start).toLocaleDateString()}
                          {event.end && ` - ${new Date(event.end).toLocaleDateString()}`}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditEventModal(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleEventDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge className="mb-2">{event.category}</Badge>
                    <p className="text-muted-foreground text-sm">
                      {event.description && event.description.substring(0, 100)}
                      {event.description && event.description.length > 100 && '...'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold heading-font">Quiz Leaderboard</h2>
          
          {leaderboard.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No quiz responses yet</p>
                <p className="text-muted-foreground">Quiz responses will appear here when students complete quizzes</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((response, index) => (
                    <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                        <div>
                          <h4 className="font-medium">{response.student_name}</h4>
                          <p className="text-sm text-muted-foreground">{response.student_email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {response.score}/{response.total_questions}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((response.score / response.total_questions) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Notice Modal */}
      <Dialog open={showNoticeModal} onOpenChange={setShowNoticeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="heading-font">
              {selectedNotice ? 'Edit Notice' : 'Create Notice'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleNoticeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="body">Content *</Label>
              <Textarea
                id="body"
                value={noticeForm.body}
                onChange={(e) => setNoticeForm(prev => ({ ...prev, body: e.target.value }))}
                rows={6}
                placeholder="Supports **markdown** formatting"
                required
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              {noticeForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {noticeForm.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X 
                        className="h-3 w-3 ml-1" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={noticeForm.start_date}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={noticeForm.end_date}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="pinned"
                checked={noticeForm.pinned}
                onCheckedChange={(checked) => setNoticeForm(prev => ({ ...prev, pinned: checked }))}
              />
              <Label htmlFor="pinned">Pin to top</Label>
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {selectedNotice && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => {
                      handleNoticeDelete(selectedNotice.id);
                      setShowNoticeModal(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNoticeModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {selectedNotice ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-font">
              {selectedEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title *</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Event description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start">Start Date & Time *</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={eventForm.start}
                  onChange={(e) => setEventForm(prev => ({ ...prev, start: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="event-end">End Date & Time</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={eventForm.end}
                  onChange={(e) => setEventForm(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-category">Category</Label>
                <select
                  id="event-category"
                  value={eventForm.category}
                  onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded p-2"
                >
                  <option value="General">General</option>
                  <option value="Math">Math</option>
                  <option value="AI">AI</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Programming">Programming</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Exam">Exam</option>
                </select>
              </div>

              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Event location or link"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {selectedEvent && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => {
                      handleEventDelete(selectedEvent.id);
                      setShowEventModal(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {selectedEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Helper function to check admin authentication
export const checkAdminAuth = () => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};

export default AdminPanel;

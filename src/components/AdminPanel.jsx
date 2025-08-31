
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
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { noticesAPI, eventsAPI } from '../lib/storage';
import { useToast } from './ui/use-toast';

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || 'admin123';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminCode, setAdminCode] = useState('');
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    body: '',
    tags: [],
    start_date: '',
    end_date: '',
    pinned: false
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Success",
        description: "Admin access granted"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid admin code",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    toast({
      title: "Success",
      description: "Logged out successfully"
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [noticesData, eventsData] = await Promise.all([
        noticesAPI.getAll(),
        eventsAPI.getAll()
      ]);
      setNotices(noticesData);
      setEvents(eventsData);
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
      
      await loadData();
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

  const handleNoticeDelete = async (noticeId) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      await noticesAPI.delete(noticeId);
      await loadData();
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

  const toggleNoticePinned = async (notice) => {
    try {
      await noticesAPI.update(notice.id, { pinned: !notice.pinned });
      await loadData();
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
          <Card className="hover-card" style={{ background: 'var(--card-bg)', boxShadow: 'var(--card-shadow)' }}>
            <CardHeader style={{ background: '#f35c7e', color: 'white', borderRadius: 'var(--border-radius) var(--border-radius) 0 0' }}>
              <CardTitle className="text-center flex items-center justify-center gap-2 text-white">
                <Settings className="h-6 w-6" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="adminCode">Admin Code</Label>
                  <Input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin code"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    TEMPORARY: Use "admin123" (change VITE_ADMIN_CODE in .env)
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
          Admin Panel
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Manage notices and events for the BSc AI Unity platform
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'notices' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('notices')}
                  size="sm"
                  className={activeTab === 'notices' ? 'btn-primary' : 'border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Notices ({notices.length})
                </Button>
                <Button
                  variant={activeTab === 'events' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('events')}
                  size="sm"
                  className={activeTab === 'events' ? 'btn-primary' : 'border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events ({events.length})
                </Button>
              </div>
              
              <div className="flex gap-2">
                {activeTab === 'notices' && (
                  <Button onClick={openCreateNoticeModal} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Notice
                  </Button>
                )}
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
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
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Events Management</p>
                <p className="text-muted-foreground mb-4">
                  Use the Calendar page to manage events with full calendar interface.
                </p>
                <Button asChild>
                  <a href="/events">
                    <Calendar className="w-4 h-4 mr-2" />
                    Go to Calendar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notice Modal */}
      <Dialog open={showNoticeModal} onOpenChange={setShowNoticeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
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
    </motion.div>
  );
};

export default AdminPanel;

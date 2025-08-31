
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Calendar, 
  Plus, 
  Filter, 
  ExternalLink,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
  Maximize2,
  Minimize2,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { eventsAPI } from '../lib/storage';
import { useToast } from './ui/use-toast';

const CATEGORY_COLORS = {
  'Class': { bg: 'var(--data-science-color)', text: 'white', border: 'var(--data-science-color)', name: 'Class' },
  'Exam': { bg: 'var(--exam-color)', text: 'white', border: 'var(--exam-color)', name: 'Exam' },
  'Result': { bg: 'var(--ai-color)', text: 'white', border: 'var(--ai-color)', name: 'Result' },
  'Activity': { bg: 'var(--workshop-color)', text: 'white', border: 'var(--workshop-color)', name: 'Activity' }
};

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const calendarRef = useRef(null);
  const { toast } = useToast();

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    category: 'Class',
    is_online: false,
    url: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedEvent) {
        await eventsAPI.update(selectedEvent.id, eventForm);
        toast({
          title: "Success",
          description: "Event updated successfully"
        });
      } else {
        await eventsAPI.create(eventForm);
        toast({
          title: "Success",
          description: "Event created successfully"
        });
      }
      
      await loadEvents();
      setShowEventModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      });
    }
  };

  const handleEventDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.delete(eventId);
      await loadEvents();
      setShowEventModal(false);
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

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      start: '',
      end: '',
      location: '',
      category: 'Class',
      is_online: false,
      url: ''
    });
    setSelectedEvent(null);
  };

  const openCreateModal = (selectInfo = null) => {
    resetForm();
    if (selectInfo) {
      const startDate = selectInfo.start;
      const endDate = selectInfo.end || new Date(startDate.getTime() + 60 * 60 * 1000);
      
      setEventForm(prev => ({
        ...prev,
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16)
      }));
    }
    setShowEventModal(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event.extendedProps);
    if (isAdmin) {
      setEventForm({
        title: event.title,
        description: event.extendedProps.description || '',
        start: event.start.toISOString().slice(0, 16),
        end: event.end.toISOString().slice(0, 16),
        location: event.extendedProps.location || '',
        category: event.extendedProps.category || 'Class',
        is_online: event.extendedProps.is_online || false,
        url: event.extendedProps.url || ''
      });
    }
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    if (isAdmin) {
      openCreateModal(selectInfo);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (isAdmin) {
      openEditModal(clickInfo.event);
    } else {
      // Show read-only event details for non-admin users
      const event = clickInfo.event.extendedProps;
      toast({
        title: event.title,
        description: `${event.description || 'No description'}\n📅 ${new Date(clickInfo.event.start).toLocaleString()}\n📍 ${event.location || 'No location'}${event.is_online ? ' (Online)' : ''}`
      });
    }
  };

  const filteredEvents = events.filter(event => 
    categoryFilter === 'all' || event.category === categoryFilter
  );

  const calendarEvents = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: CATEGORY_COLORS[event.category]?.bg || '#6c63ff',
    borderColor: CATEGORY_COLORS[event.category]?.bg || '#6c63ff',
    textColor: 'white',
    extendedProps: event
  }));

  const addSampleData = async () => {
    const now = new Date();
    const sampleEvents = [
      {
        title: 'Data Structures - Mon',
        description: 'Weekly Data Structures class',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 - now.getDay() + 7) % 7, 9, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 - now.getDay() + 7) % 7, 11, 0).toISOString(),
        location: 'Virtual Classroom',
        category: 'Class',
        is_online: true,
        url: 'https://meet.google.com/example'
      },
      {
        title: 'AI Ethics - Wed',
        description: 'AI Ethics and Philosophy',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (3 - now.getDay() + 7) % 7, 14, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (3 - now.getDay() + 7) % 7, 16, 0).toISOString(),
        location: 'Room 101',
        category: 'Class',
        is_online: false,
        url: ''
      },
      {
        title: 'Machine Learning - Fri',
        description: 'Practical ML applications',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (5 - now.getDay() + 7) % 7, 10, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (5 - now.getDay() + 7) % 7, 12, 0).toISOString(),
        location: 'Lab 2',
        category: 'Class',
        is_online: false,
        url: ''
      }
    ];

    try {
      for (const event of sampleEvents) {
        await eventsAPI.create(event);
      }
      await loadEvents();
      toast({
        title: "Success",
        description: "Sample events added successfully"
      });
    } catch (error) {
      console.error('Failed to add sample data:', error);
      toast({
        title: "Error",
        description: "Failed to add sample data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          <div className="h-96 bg-muted rounded"></div>
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
          Calendar & Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Keep track of your classes, exams, and important academic events
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="hover-card" style={{ background: '#f35c7e', color: 'white' }}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {isAdmin && (
                  <Button 
                    onClick={() => openCreateModal()} 
                    size="sm"
                    className="bg-white text-[#f35c7e] hover:bg-white/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                )}
                
                <Button 
                  onClick={addSampleData} 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Sample Data
                </Button>

                <Button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                  {isExpanded ? 'Minimize' : 'Expand'}
                </Button>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1 rounded-md border border-white/30 bg-white/10 text-white text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <option value="all" style={{ color: 'black' }}>All Categories</option>
                  <option value="Class" style={{ color: 'black' }}>Classes</option>
                  <option value="Exam" style={{ color: 'black' }}>Exams</option>
                  <option value="Result" style={{ color: 'black' }}>Results</option>
                  <option value="Activity" style={{ color: 'black' }}>Activities</option>
                </select>

                {isAdmin && (
                  <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <a href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </a>
                  </Button>
                )}
              </div>

              <div className="legend-items flex items-center gap-4">
                {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
                  <div key={category} className="legend-item flex items-center gap-2">
                    <div 
                      className="legend-color w-4 h-4 rounded" 
                      style={{ backgroundColor: colors.bg }}
                    ></div>
                    <span className="text-white text-sm">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={isExpanded ? 'fixed inset-0 z-50 p-4 bg-background/95 backdrop-blur' : ''}
      >
        <Card className="hover-card h-full overflow-auto">
          <CardContent className="p-6">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              selectable={isAdmin}
              selectMirror={true}
              dayMaxEvents={isExpanded ? false : 3}
              weekends={true}
              select={isAdmin ? handleDateSelect : undefined}
              eventClick={handleEventClick}
              height={isExpanded ? 'calc(100vh - 200px)' : 'auto'}
              eventDisplay="block"
              eventTextColor="white"
              eventClassNames={(arg) => `event-${arg.event.extendedProps.category?.toLowerCase()}`}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <div className="legend" style={{ background: '#f35c7e', borderRadius: 'var(--border-radius)', padding: '15px', boxShadow: 'var(--card-shadow)' }}>
          <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '10px' }}>Event Categories</h3>
          <div className="legend-items flex flex-wrap gap-4">
            {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
              <div key={category} className="legend-item flex items-center gap-2">
                <div 
                  className="legend-color w-4 h-4 rounded" 
                  style={{ backgroundColor: colors.bg }}
                ></div>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto hover-card">
          <DialogHeader style={{ background: '#f35c7e', color: 'white', margin: '-24px -24px 20px -24px', padding: '20px 24px', borderRadius: 'var(--border-radius) var(--border-radius) 0 0' }}>
            <DialogTitle className="text-white">
              {!isAdmin ? 'Event Details' : selectedEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

          {!isAdmin && selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Start:</span>
                  <p>{new Date(selectedEvent.start).toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">End:</span>
                  <p>{new Date(selectedEvent.end).toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <p>{selectedEvent.location || 'TBA'}</p>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <Badge style={{ backgroundColor: CATEGORY_COLORS[selectedEvent.category]?.bg, color: 'white' }}>
                    {selectedEvent.category}
                  </Badge>
                </div>
              </div>
              {selectedEvent.is_online && selectedEvent.url && (
                <Button asChild className="w-full btn-primary">
                  <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Online
                  </a>
                </Button>
              )}
            </div>
          ) : isAdmin ? (
            <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start *</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={eventForm.start}
                  onChange={(e) => setEventForm(prev => ({ ...prev, start: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end">End *</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={eventForm.end}
                  onChange={(e) => setEventForm(prev => ({ ...prev, end: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={eventForm.category}
                onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="Class">Class</option>
                <option value="Exam">Exam</option>
                <option value="Result">Result</option>
                <option value="Activity">Activity</option>
              </select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_online"
                checked={eventForm.is_online}
                onCheckedChange={(checked) => setEventForm(prev => ({ ...prev, is_online: checked }))}
              />
              <Label htmlFor="is_online">Online Event</Label>
            </div>

            {eventForm.is_online && (
              <div>
                <Label htmlFor="url">Meeting URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={eventForm.url}
                  onChange={(e) => setEventForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <div>
                {selectedEvent && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => handleEventDelete(selectedEvent.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEventModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EventsCalendar;

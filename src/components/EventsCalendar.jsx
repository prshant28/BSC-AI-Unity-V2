
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
  Trash2
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
  'Class': { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' },
  'Exam': { bg: 'bg-red-500', text: 'text-white', border: 'border-red-500' },
  'Result': { bg: 'bg-green-500', text: 'text-white', border: 'border-green-500' },
  'Activity': { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500' }
};

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [calendarView, setCalendarView] = useState('dayGridMonth');
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
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    openCreateModal(selectInfo);
  };

  const handleEventClick = (clickInfo) => {
    openEditModal(clickInfo.event);
  };

  const filteredEvents = events.filter(event => 
    categoryFilter === 'all' || event.category === categoryFilter
  );

  const calendarEvents = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: CATEGORY_COLORS[event.category]?.bg.replace('bg-', '#') || '#3B82F6',
    borderColor: CATEGORY_COLORS[event.category]?.bg.replace('bg-', '#') || '#3B82F6',
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
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button onClick={() => openCreateModal()} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
                
                <Button onClick={addSampleData} variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Sample Data
                </Button>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Class">Classes</option>
                  <option value="Exam">Exams</option>
                  <option value="Result">Results</option>
                  <option value="Activity">Activities</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
                  <Badge key={category} variant="outline" className={colors.border}>
                    {category}
                  </Badge>
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
      >
        <Card>
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
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              eventDisplay="block"
              eventTextColor="white"
              eventBackgroundColor="#3B82F6"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

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
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EventsCalendar;

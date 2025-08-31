
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Calendar,
  Plus,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  Grid,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { eventsAPI } from "../lib/storage";
import { useToast } from "./ui/use-toast";

const EventsCalendar = ({ isAdmin = false }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("calendar");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    category: "General",
    location: "",
  });

  const categories = [
    { value: "all", label: "All Events", color: "#6c63ff" },
    { value: "Math", label: "Mathematics", color: "#ff6b9d" },
    { value: "AI", label: "Artificial Intelligence", color: "#00d9b5" },
    { value: "Data Science", label: "Data Science", color: "#6c63ff" },
    { value: "Programming", label: "Programming", color: "#ffb86c" },
    { value: "Workshop", label: "Workshop", color: "#9d8cff" },
    { value: "Exam", label: "Examination", color: "#ff5757" },
    { value: "General", label: "General", color: "#8a8a9a" },
  ];

  useEffect(() => {
    loadEvents();
    // Add sample weekly schedule if no events exist
    addSampleSchedule();
  }, []);

  const addSampleSchedule = async () => {
    try {
      const existingEvents = await eventsAPI.getAll();
      if (existingEvents.length === 0) {
        // Add sample weekly schedule - replace with actual schedule from PDF
        const sampleEvents = [
          {
            id: 'schedule-ata-1',
            title: 'ATA - Algorithmic Thinking and Applications',
            start: '2025-01-27T10:00:00',
            end: '2025-01-27T11:30:00',
            category: 'AI',
            location: 'Online',
            description: 'Regular class session',
            backgroundColor: '#00d9b5',
            borderColor: '#00d9b5',
          },
          {
            id: 'schedule-bda-1',
            title: 'BDA - Basics of Data Analytics',
            start: '2025-01-28T14:00:00',
            end: '2025-01-28T15:30:00',
            category: 'Data Science',
            location: 'Online',
            description: 'Regular class session',
            backgroundColor: '#6c63ff',
            borderColor: '#6c63ff',
          },
          {
            id: 'schedule-fsp-1',
            title: 'FSP - Foundations of Statistics and Probability',
            start: '2025-01-29T10:00:00',
            end: '2025-01-29T11:30:00',
            category: 'Math',
            location: 'Online',
            description: 'Regular class session',
            backgroundColor: '#ff6b9d',
            borderColor: '#ff6b9d',
          },
          {
            id: 'schedule-lana-1',
            title: 'LANA - Linear Algebra and Numerical Analysis',
            start: '2025-01-30T16:00:00',
            end: '2025-01-30T17:30:00',
            category: 'Math',
            location: 'Online',
            description: 'Regular class session',
            backgroundColor: '#ff6b9d',
            borderColor: '#ff6b9d',
          },
        ];

        for (const event of sampleEvents) {
          await eventsAPI.create(event);
        }
      }
    } catch (error) {
      console.error('Failed to add sample schedule:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.category === selectedCategory),
      );
    }
  }, [events, selectedCategory]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsAPI.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === info.event.id);
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can create events",
        variant: "destructive",
      });
      return;
    }

    setEventForm({
      title: "",
      description: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr || selectInfo.startStr,
      category: "General",
      location: "",
    });
    setShowCreateModal(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        ...eventForm,
        id: `event-${Date.now()}`,
        backgroundColor: getCategoryColor(eventForm.category),
        borderColor: getCategoryColor(eventForm.category),
      };

      await eventsAPI.create(eventData);
      await loadEvents();
      setShowCreateModal(false);
      resetEventForm();

      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();

    try {
      await eventsAPI.update(selectedEvent.id, eventForm);
      await loadEvents();
      setShowEventModal(false);

      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleEventDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventsAPI.delete(selectedEvent.id);
      await loadEvents();
      setShowEventModal(false);

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      start: "",
      end: "",
      category: "General",
      location: "",
    });
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      Math: "#ff6b9d",
      AI: "#00d9b5",
      "Data Science": "#6c63ff",
      Programming: "#ffb86c",
      Workshop: "#9d8cff",
      Exam: "#ff5757",
      General: "#8a8a9a",
    };
    return categoryMap[category] || categoryMap["General"];
  };

  const calendarEvents = filteredEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: getCategoryColor(event.category),
    borderColor: getCategoryColor(event.category),
    textColor: "#ffffff",
    extendedProps: {
      description: event.description,
      category: event.category,
      location: event.location,
    },
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {isAdmin && (
              <Button onClick={() => setShowCreateModal(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              selectable={isAdmin}
              select={isAdmin ? handleDateSelect : undefined}
              height="auto"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventDidMount={(info) => {
                info.el.style.borderRadius = "6px";
                info.el.style.border = "none";
                info.el.style.fontSize = "12px";
                info.el.style.fontWeight = "500";
              }}
              dayCellDidMount={(info) => {
                // Ensure proper theme colors for calendar cells
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                  info.el.style.backgroundColor = 'var(--background)';
                  info.el.style.color = 'var(--foreground)';
                }
              }}
              viewDidMount={(info) => {
                // Apply theme-aware styles to calendar elements
                const isDark = document.documentElement.classList.contains('dark');
                const calendarEl = info.el;
                
                if (isDark) {
                  calendarEl.style.setProperty('--fc-border-color', 'var(--border)');
                  calendarEl.style.setProperty('--fc-button-bg-color', 'var(--secondary)');
                  calendarEl.style.setProperty('--fc-button-border-color', 'var(--border)');
                  calendarEl.style.setProperty('--fc-button-hover-bg-color', 'var(--secondary)');
                  calendarEl.style.setProperty('--fc-button-active-bg-color', 'var(--primary)');
                  calendarEl.style.setProperty('--fc-today-bg-color', 'var(--muted)');
                  calendarEl.style.color = 'var(--foreground)';
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    style={{
                      backgroundColor: getCategoryColor(event.category),
                    }}
                  >
                    {event.category}
                  </Badge>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventForm({
                            title: event.title,
                            description: event.description || "",
                            start: event.start,
                            end: event.end || "",
                            category: event.category || "General",
                            location: event.location || "",
                          });
                          setShowCreateModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedEvent(event);
                          handleEventDelete();
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(event.start).toLocaleString()}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.start).toLocaleString()}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEvent(event);
                            setEventForm({
                              title: event.title,
                              description: event.description || "",
                              start: event.start,
                              end: event.end || "",
                              category: event.category || "General",
                              location: event.location || "",
                            });
                            setShowCreateModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedEvent(event);
                            handleEventDelete();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-font flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  style={{
                    backgroundColor: getCategoryColor(selectedEvent.category),
                  }}
                >
                  {selectedEvent.category}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleString()}
                    {selectedEvent.end &&
                      ` - ${new Date(selectedEvent.end).toLocaleString()}`}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {isAdmin && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEventForm({
                        title: selectedEvent.title,
                        description: selectedEvent.description || "",
                        start: selectedEvent.start,
                        end: selectedEvent.end || "",
                        category: selectedEvent.category || "General",
                        location: selectedEvent.location || "",
                      });
                      setShowEventModal(false);
                      setShowCreateModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={handleEventDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-font">
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={selectedEvent ? handleEventUpdate : handleEventSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="event-title">Title *</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, start: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="event-end">End Date & Time</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={eventForm.end}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-category">Category</Label>
                <select
                  id="event-category"
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="General">General</option>
                  <option value="Math">Mathematics</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Programming">Programming</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Exam">Examination</option>
                </select>
              </div>

              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Event location or online link"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetEventForm();
                  setSelectedEvent(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {events.filter((e) => new Date(e.start) > new Date()).length}
            </p>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {new Set(events.map((e) => e.category)).size}
            </p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default EventsCalendar;

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
  Download,
  Settings,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
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
import { checkAdminAuth } from "./AdminPanel";

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
    setIsAdmin(checkAdminAuth());
  }, []);

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
      className="container mx-auto py-8 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text heading-font">
          Events Calendar
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto body-font">
          Stay updated with all academic events, workshops, and important dates
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

                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((cat) => (
                    <Badge
                      key={cat.value}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: cat.color + "20",
                        color: cat.color,
                      }}
                    >
                      {cat.label}
                    </Badge>
                  ))}
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
            />
          </CardContent>
        </Card>
      </motion.div>

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
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
      </motion.div>
    </motion.div>
  );
};

export default EventsCalendar;

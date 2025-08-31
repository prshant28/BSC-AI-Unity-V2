
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BACKEND = import.meta.env.VITE_STORAGE_BACKEND || 'local';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is available
const isSupabaseEnabled = STORAGE_BACKEND === 'supabase' && SUPABASE_URL && SUPABASE_ANON_KEY;

// Local storage keys
const NOTICES_KEY = 'notices:v1';
const EVENTS_KEY = 'events:v1';

// Sample data
const sampleNotices = [
  {
    id: uuidv4(),
    title: 'Mid-Semester Examination Schedule',
    body: '**Important Notice**: Mid-semester examinations will be conducted from **March 15-22, 2024**.\n\nAll students are required to check their individual timetables on the student portal.',
    tags: ['Exam', 'Important'],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    pinned: true,
    created_at: new Date().toISOString(),
    created_by: 'admin'
  },
  {
    id: uuidv4(),
    title: 'Workshop on Machine Learning Applications',
    body: 'Join us for an interactive workshop on practical ML applications in industry. Industry experts will share insights and hands-on experience.',
    tags: ['Workshop', 'ML', 'Industry'],
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    pinned: false,
    created_at: new Date().toISOString(),
    created_by: 'admin'
  }
];

const sampleEvents = [
  {
    id: uuidv4(),
    title: 'Data Structures - Lecture',
    description: 'Advanced Tree Algorithms',
    start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Virtual Classroom',
    category: 'Class',
    is_online: true,
    url: 'https://meet.google.com/example',
    created_at: new Date().toISOString(),
    created_by: 'admin'
  },
  {
    id: uuidv4(),
    title: 'AI Ethics Exam',
    description: 'Final examination for AI Ethics course',
    start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: 'Exam Hall A',
    category: 'Exam',
    is_online: false,
    url: null,
    created_at: new Date().toISOString(),
    created_by: 'admin'
  },
  {
    id: uuidv4(),
    title: 'Semester Results Declaration',
    description: 'Results for current semester will be published',
    start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
    location: 'Student Portal',
    category: 'Result',
    is_online: true,
    url: 'https://portal.example.com',
    created_at: new Date().toISOString(),
    created_by: 'admin'
  }
];

// Local storage functions
const getFromLocalStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Initialize sample data if none exists
const initializeSampleData = () => {
  const existingNotices = getFromLocalStorage(NOTICES_KEY);
  const existingEvents = getFromLocalStorage(EVENTS_KEY);
  
  if (existingNotices.length === 0) {
    setToLocalStorage(NOTICES_KEY, sampleNotices);
  }
  
  if (existingEvents.length === 0) {
    setToLocalStorage(EVENTS_KEY, sampleEvents);
  }
};

// Notices API
export const noticesAPI = {
  async getAll() {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }
    
    initializeSampleData();
    return getFromLocalStorage(NOTICES_KEY, []);
  },

  async create(notice) {
    const newNotice = {
      id: uuidv4(),
      ...notice,
      created_at: new Date().toISOString(),
      created_by: 'admin'
    };

    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const notices = getFromLocalStorage(NOTICES_KEY, []);
    notices.push(newNotice);
    setToLocalStorage(NOTICES_KEY, notices);
    return newNotice;
  },

  async update(id, updates) {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const notices = getFromLocalStorage(NOTICES_KEY, []);
    const index = notices.findIndex(n => n.id === id);
    if (index !== -1) {
      notices[index] = { ...notices[index], ...updates };
      setToLocalStorage(NOTICES_KEY, notices);
      return notices[index];
    }
    throw new Error('Notice not found');
  },

  async delete(id) {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const notices = getFromLocalStorage(NOTICES_KEY, []);
    const filtered = notices.filter(n => n.id !== id);
    setToLocalStorage(NOTICES_KEY, filtered);
  }
};

// Events API
export const eventsAPI = {
  async getAll() {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }
    
    initializeSampleData();
    return getFromLocalStorage(EVENTS_KEY, []);
  },

  async create(event) {
    const newEvent = {
      id: uuidv4(),
      ...event,
      created_at: new Date().toISOString(),
      created_by: 'admin'
    };

    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const events = getFromLocalStorage(EVENTS_KEY, []);
    events.push(newEvent);
    setToLocalStorage(EVENTS_KEY, events);
    return newEvent;
  },

  async update(id, updates) {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const events = getFromLocalStorage(EVENTS_KEY, []);
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      setToLocalStorage(EVENTS_KEY, events);
      return events[index];
    }
    throw new Error('Event not found');
  },

  async delete(id) {
    if (isSupabaseEnabled) {
      // TODO: Implement Supabase integration
      throw new Error('Supabase integration not implemented');
    }

    const events = getFromLocalStorage(EVENTS_KEY, []);
    const filtered = events.filter(e => e.id !== id);
    setToLocalStorage(EVENTS_KEY, filtered);
  }
};

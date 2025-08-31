import { v4 as uuidv4 } from 'uuid';

const STORAGE_BACKEND = import.meta.env.VITE_STORAGE_BACKEND || 'local';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is available
const isSupabaseEnabled = STORAGE_BACKEND === 'supabase' && SUPABASE_URL && SUPABASE_ANON_KEY;

// Local storage keys
const NOTICES_KEY = 'notices:v1';
const EVENTS_KEY = 'events:v1';

// Initialize sample data if none exists
const initializeSampleData = () => {
  const existingNotices = getFromLocalStorage(NOTICES_KEY, []);
  const existingEvents = getFromLocalStorage(EVENTS_KEY, []);

  if (existingNotices.length === 0) {
    const sampleNotices = [
      {
        id: uuidv4(),
        title: 'Welcome to BSc AI Unity Platform',
        body: '**Welcome** to our academic platform! Here you will find all important announcements, events, and community discussions.\n\nPlease bookmark this page and check regularly for updates.',
        tags: ['Welcome', 'Important'],
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        pinned: true,
        created_at: new Date().toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'Semester 1 Exam Schedule Released',
        body: 'The examination schedule for Semester 1 has been released. Please check the Events calendar for detailed timings and venues.\n\n**Important:** All students must carry their ID cards during exams.',
        tags: ['Exams', 'Schedule'],
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pinned: false,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'AI Ethics Workshop - Registration Open',
        body: 'Join us for an interactive workshop on ethical considerations in AI development and deployment. **Limited seats available** - register now!\n\nTopics covered:\n- Bias in AI systems\n- Privacy and data protection\n- AI decision-making transparency',
        tags: ['Workshop', 'AI Ethics', 'Registration'],
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pinned: true,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin'
      }
    ];
    setToLocalStorage(NOTICES_KEY, sampleNotices);
  }

  if (existingEvents.length === 0) {
    const now = new Date();
    const sampleEvents = [
      {
        id: uuidv4(),
        title: 'Linear Algebra',
        description: 'Introduction to vectors, matrices, and linear transformations. Please bring your textbook.',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 - now.getDay() + 7) % 7, 10, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 - now.getDay() + 7) % 7, 11, 30).toISOString(),
        location: 'Classroom 201',
        category: 'Class',
        is_online: false,
        url: '',
        created_at: new Date().toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'Python Programming',
        description: 'Advanced Python concepts including decorators, generators, and context managers.',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (2 - now.getDay() + 7) % 7, 14, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (2 - now.getDay() + 7) % 7, 15, 30).toISOString(),
        location: 'Computer Lab 101',
        category: 'Class',
        is_online: false,
        url: '',
        created_at: new Date().toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'Neural Networks',
        description: 'Understanding neural networks architecture and backpropagation. Assignment due next week.',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (3 - now.getDay() + 7) % 7, 11, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (3 - now.getDay() + 7) % 7, 12, 30).toISOString(),
        location: 'Online (Zoom)',
        category: 'Class',
        is_online: true,
        url: 'https://zoom.us/j/example',
        created_at: new Date().toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'Midterm Exam',
        description: 'Comprehensive exam covering all topics discussed in the first half of the semester.',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 10, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 12, 0).toISOString(),
        location: 'Examination Hall',
        category: 'Exam',
        is_online: false,
        url: '',
        created_at: new Date().toISOString(),
        created_by: 'admin'
      },
      {
        id: uuidv4(),
        title: 'AI Ethics Workshop',
        description: 'Interactive workshop on ethical considerations in AI development and deployment.',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 14, 0).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 17, 0).toISOString(),
        location: 'Conference Hall',
        category: 'Activity',
        is_online: false,
        url: '',
        created_at: new Date().toISOString(),
        created_by: 'admin'
      }
    ];
    setToLocalStorage(EVENTS_KEY, sampleEvents);
  }
};

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

import { supabase } from './supabaseClient';

export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        user_session: localStorage.getItem('userSession') || 'anonymous_' + Date.now()
      });

    if (error) {
      console.error('Analytics error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page: pageName });
};

export const trackUserAction = (action, details = {}) => {
  trackEvent('user_action', { action, ...details });
};

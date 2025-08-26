
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing pending changes...",
      });
      // Process pending actions
      processPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "You're offline. Changes will sync when connection is restored.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingAction = (action) => {
    if (!isOnline) {
      setPendingActions(prev => [...prev, action]);
      localStorage.setItem('pendingActions', JSON.stringify([...pendingActions, action]));
    }
  };

  const processPendingActions = async () => {
    const stored = localStorage.getItem('pendingActions');
    if (stored) {
      const actions = JSON.parse(stored);
      // Process each action
      for (const action of actions) {
        try {
          await action.execute();
        } catch (error) {
          console.error('Failed to sync action:', error);
        }
      }
      localStorage.removeItem('pendingActions');
      setPendingActions([]);
    }
  };

  return { isOnline, addPendingAction };
};

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ConcernsPage from '@/pages/ConcernsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AddConcernPage from '@/pages/AddConcernPage';
import StatusBoardPage from '@/pages/StatusBoardPage';
import AboutCoursePage from '@/pages/AboutCoursePage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import KnowYourRightsPage from '@/pages/KnowYourRightsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle } from 'lucide-react';
// CONCERNS_STORAGE_KEY and SAMPLE_CONCERNS are removed as we use Supabase

const PrivacyPolicyPage = () => <div className="container mx-auto py-12 px-4 md:px-6 text-center"><h1>Privacy Policy</h1><p>Content coming soon...</p></div>;
const TermsOfServicePage = () => <div className="container mx-auto py-12 px-4 md:px-6 text-center"><h1>Terms of Service</h1><p>Content coming soon...</p></div>;

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

function App() {
  const [concerns, setConcerns] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loadingConcerns, setLoadingConcerns] = useState(true);
  const { toast } = useToast();

  const fetchConcerns = useCallback(async () => {
    setLoadingConcerns(true);
    const { data, error } = await supabase
      .from('concerns')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching concerns:', error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Fetching Data</span>
          </div>
        ),
        description: "Could not load concerns from the database. Please try again later.",
        variant: "destructive",
      });
      setConcerns([]); // Set to empty array on error
    } else {
      setConcerns(data || []);
    }
    setLoadingConcerns(false);
  }, [toast]);

  useEffect(() => {
    fetchConcerns();
  }, [fetchConcerns]);

  // Removed useEffect for localStorage as data is now from Supabase

  const addConcern = async (newConcernData) => {
    const concernToAdd = {
      ...newConcernData, // author, title, message, concern_type, status
      timestamp: new Date().toISOString(),
      // Supabase handles id, created_at, updated_at
    };

    const { data, error } = await supabase
      .from('concerns')
      .insert([concernToAdd])
      .select();

    if (error) {
      console.error('Error adding concern:', error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Submitting Concern</span>
          </div>
        ),
        description: error.message || "Could not save your concern. Please try again.",
        variant: "destructive",
      });
      return null;
    } else {
      // Fetch concerns again to get the latest list including the new one with DB-generated ID
      // Or, if insert returns the new item, add it to state directly
      if (data && data.length > 0) {
        setConcerns(prevConcerns => [data[0], ...prevConcerns].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } else {
        fetchConcerns(); // Fallback to refetch all if insert doesn't return data as expected
      }
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-semibold">Concern Submitted</span>
          </div>
        ),
        description: "Your concern has been successfully submitted.",
      });
      return data ? data[0] : null;
    }
  };
  
  const updateConcernStatus = async (concernId, newStatus) => {
    const { data, error } = await supabase
      .from('concerns')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', concernId)
      .select();

    if (error) {
      console.error('Error updating concern status:', error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Updating Status</span>
          </div>
        ),
        description: error.message || "Could not update concern status. Please try again.",
        variant: "destructive",
      });
    } else {
      if (data && data.length > 0) {
        setConcerns(prevConcerns => 
          prevConcerns.map(c => 
            c.id === concernId ? data[0] : c
          ).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      } else {
        fetchConcerns(); // Fallback if update doesn't return data
      }
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-semibold">Status Updated</span>
          </div>
        ),
        description: `Concern status successfully changed to ${newStatus}.`,
      });
    }
  };

  const handleAdminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true'); // Keep admin auth in localStorage
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAdminAuthenticated');
    if (storedAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);


  return (
    <ThemeProvider defaultTheme="system" storageKey="bscai-unity-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout isAdminAuthenticated={isAdminAuthenticated} handleAdminLogout={handleAdminLogout} />}>
            <Route index element={<HomePage concerns={concerns} loading={loadingConcerns} />} />
            <Route path="concerns" element={<ConcernsPage concerns={concerns} loading={loadingConcerns} />} />
            <Route path="add-concern" element={<AddConcernPage addConcern={addConcern} />} />
            <Route path="status-board" element={<StatusBoardPage concerns={concerns} loading={loadingConcerns} />} />
            <Route path="about-course" element={<AboutCoursePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="know-your-rights" element={<KnowYourRightsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />
            
            <Route 
              path="admin-login" 
              element={!isAdminAuthenticated ? <AdminLoginPage handleAdminLogin={handleAdminLogin} /> : <Navigate to="/admin/dashboard" replace />} 
            />
            
            <Route 
              path="admin/dashboard" 
              element={isAdminAuthenticated ? <AdminDashboardPage concerns={concerns} updateConcernStatus={updateConcernStatus} loading={loadingConcerns} fetchConcerns={fetchConcerns} /> : <Navigate to="/admin-login" replace />} 
            />

            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
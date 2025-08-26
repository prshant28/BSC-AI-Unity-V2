import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ConcernsPage from "@/pages/ConcernsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AddConcernPage from "@/pages/AddConcernPage";
import StatusBoardPage from "@/pages/StatusBoardPage";
import AboutCoursePage from "@/pages/AboutCoursePage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import KnowYourRightsPage from "@/pages/KnowYourRightsPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage"; // This is now the Admin Layout/Router Outlet
import Semester1QuizzesPage from "@/pages/Semester1QuizzesPage";
import QuizInterfacePage from "@/pages/QuizInterfacePage";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";

const PrivacyPolicyPage = () => (
  <div className="container mx-auto py-12 px-4 md:px-6 text-center">
    <h1>Privacy Policy</h1>
    <p>Content coming soon...</p>
  </div>
);
const TermsOfServicePage = () => (
  <div className="container mx-auto py-12 px-4 md:px-6 text-center">
    <h1>Terms of Service</h1>
    <p>Content coming soon...</p>
  </div>
);

function App() {
  const [concerns, setConcerns] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loadingConcerns, setLoadingConcerns] = useState(true);
  const { toast } = useToast();

  const fetchConcerns = useCallback(async () => {
    setLoadingConcerns(true);
    const { data, error } = await supabase
      .from("concerns")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching concerns:", error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Fetching Data</span>
          </div>
        ),
        description:
          "Could not load concerns from the database. Please try again later.",
        variant: "destructive",
      });
      setConcerns([]);
    } else {
      setConcerns(data || []);
    }
    setLoadingConcerns(false);
  }, [toast]);

  useEffect(() => {
    fetchConcerns();

    // Set up real-time subscription for concerns
    const subscription = supabase
      .channel('concerns-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'concerns' }, (payload) => {
        console.log('Concern change detected:', payload);
        fetchConcerns();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'concern_replies' }, (payload) => {
        console.log('Concern reply change detected:', payload);
        fetchConcerns();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchConcerns]);

  const addConcern = async (newConcernData) => {
    const concernToAdd = {
      ...newConcernData,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("concerns")
      .insert([concernToAdd])
      .select();

    if (error) {
      console.error("Error adding concern:", error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Submitting Concern</span>
          </div>
        ),
        description:
          error.message || "Could not save your concern. Please try again.",
        variant: "destructive",
      });
      return null;
    } else {
      if (data && data.length > 0) {
        setConcerns((prevConcerns) =>
          [data[0], ...prevConcerns].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
          ),
        );
      } else {
        fetchConcerns(); // Fallback to refetch if insert didn't return data
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
      .from("concerns")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", concernId)
      .select();

    if (error) {
      console.error("Error updating concern status:", error);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Error Updating Status</span>
          </div>
        ),
        description:
          error.message || "Could not update concern status. Please try again.",
        variant: "destructive",
      });
    } else {
      if (data && data.length > 0) {
        setConcerns((prevConcerns) =>
          prevConcerns
            .map((c) => (c.id === concernId ? data[0] : c))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        );
      } else {
        fetchConcerns(); // Fallback
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

  const handleAdminLogin = async (email, password) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email, password_hash")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error("Login error or user not found:", error);
      return false;
    }

    // IMPORTANT: This is a placeholder for password comparison.
    // In a real app, use bcrypt.compare or a secure Supabase function.
    if (data.password_hash === password) {
      setIsAdminAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      return true;
    }

    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("isAdminAuthenticated");
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAdminAuthenticated");
    if (storedAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="bscai-unity-theme">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                isAdminAuthenticated={isAdminAuthenticated}
                handleAdminLogout={handleAdminLogout}
              />
            }
          >
            <Route
              index
              element={
                <HomePage concerns={concerns} loading={loadingConcerns} />
              }
            />
            <Route
              path="concerns"
              element={
                <ConcernsPage concerns={concerns} loading={loadingConcerns} />
              }
            />
            <Route
              path="add-concern"
              element={<AddConcernPage addConcern={addConcern} />}
            />
            <Route
              path="status-board"
              element={
                <StatusBoardPage
                  concerns={concerns}
                  loading={loadingConcerns}
                />
              }
            />
            <Route path="about-course" element={<AboutCoursePage />} />
            <Route
              path="semester-1-quizzes"
              element={<Semester1QuizzesPage />}
            />
            <Route
              path="semester-1-quizzes/:subjectId/take"
              element={<QuizInterfacePage />}
            />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="know-your-rights" element={<KnowYourRightsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />

            <Route
              path="admin-login"
              element={
                !isAdminAuthenticated ? (
                  <AdminLoginPage handleAdminLogin={handleAdminLogin} />
                ) : (
                  <Navigate to="/admin/dashboard/overview" replace />
                )
              }
            />

            {/* AdminDashboardPage is now a layout for nested admin routes */}
            <Route
              path="admin/dashboard/*" // Use "/*" to allow nested routes
              element={
                isAdminAuthenticated ? (
                  <AdminDashboardPage
                    concerns={concerns}
                    updateConcernStatus={updateConcernStatus}
                    loading={loadingConcerns}
                    fetchConcerns={fetchConcerns}
                  />
                ) : (
                  <Navigate to="/admin-login" replace />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
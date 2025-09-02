import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabaseClient";
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
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";
import FeaturesPage from "@/pages/FeaturesPage";
import StudentAchievementsPage from "@/pages/StudentAchievementsPage";
import AIToolsPage from "@/pages/AIToolsPage";
import PerplexityPromoPage from "@/pages/PerplexityPromoPage";
import PollsSurveysPage from "@/pages/PollsSurveysPage"; // Added PollsSurveysPage
import ForumEmbed from './components/ForumEmbed';
import NoticeBoard from './components/NoticeBoard';
import EventsCalendar from './components/EventsCalendar';
import AdminPanel from './components/AdminPanel';
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";


const PrivacyPolicyPageContent = () => (
  <div className="container mx-auto py-12 px-4 md:px-6 text-center">
    <h1 className="text-3xl font-bold mb-4">Official IIT Privacy Policy</h1>
    <p className="mb-4">This is the official IIT Privacy Policy. Please refer to the official IIT website for the most accurate and up-to-date information.</p>
    <p className="mb-4">All details on this platform are collected from available data and published here for educational purposes only. BSC AI Unity is not affiliated with or endorsed by IIT.</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      © BSC AI Unity | All Rights Reserved 2025
    </p>
  </div>
);

const TermsOfServicePageContent = () => (
  <div className="container mx-auto py-12 px-4 md:px-6 text-center">
    <h1 className="text-3xl font-bold mb-4">Official IIT Terms and Conditions</h1>
    <p className="mb-4">These are the official IIT Terms and Conditions. Please refer to the official IIT website for the most accurate and up-to-date information.</p>
    <p className="mb-4">All details on this platform are collected from available data and published here for educational purposes only. BSC AI Unity is not affiliated with or endorsed by IIT. We do not claim anything about this program.</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      © BSC AI Unity | All Rights Reserved 2025
    </p>
  </div>
);

const ComingSoonPage = ({ title }) => (
  <div className="container mx-auto py-12 px-4 md:px-6 text-center">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300">Coming Soon!</p>
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
            <Route path="know-your-rights" element={<KnowYourRightsPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="student-achievements" element={<ComingSoonPage title="Student Achievements" />} />
            <Route path="semester-1-quizzes" element={<Semester1QuizzesPage />} />
            <Route path="semester-1-quizzes/:subjectId/take" element={<QuizInterfacePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPageContent />} />
            <Route path="terms-of-service" element={<TermsOfServicePageContent />} />
            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/perplexity-promo" element={<PerplexityPromoPage />} />
            <Route path="/forum" element={<ForumEmbed />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/events" element={<EventsCalendar />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/polls-surveys" element={<PollsSurveysPage />} /> {/* Added route for polls and surveys */}


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
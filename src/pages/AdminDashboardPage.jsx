import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminContentManagementPage from "@/pages/admin/AdminContentManagementPage";
import AdminSubjectManagementPage from "@/pages/admin/AdminSubjectManagementPage";
import AdminQuestionManagementPage from "@/pages/admin/AdminQuestionManagementPage";
import AdminResponseViewerPage from "@/pages/admin/AdminResponseViewerPage";
import AdminLeaderboardPage from "@/pages/admin/AdminLeaderboardPage";
import AdminConcernsPage from "@/pages/admin/AdminConcernsPage";
import OldAdminDashboardPage from "@/pages/admin/OldAdminDashboardPage"; // Renamed original dashboard
import { motion } from "framer-motion";

const AdminDashboardPage = ({
  concerns,
  updateConcernStatus,
  loading,
  fetchConcerns,
}) => {
  return (
    <div className="flex h-full">
      <AdminSidebar />
      <motion.main
        className="flex-1 overflow-y-auto bg-muted/30 dark:bg-muted/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard/overview" replace />} />
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="content" element={<AdminContentManagementPage />} />
          <Route path="subjects" element={<AdminSubjectManagementPage />} />
          <Route path="questions" element={<AdminQuestionManagementPage />} />
          <Route path="responses" element={<AdminResponseViewerPage />} />
          <Route path="leaderboard" element={<AdminLeaderboardPage />} />
          <Route
            path="concerns"
            element={
              <AdminConcernsPage />
            }
          />
          {/* Add other admin routes here */}
          <Route path="*" element={<Navigate to="/admin/dashboard/overview" replace />} />
        </Routes>
      </motion.main>
    </div>
  );
};

export default AdminDashboardPage;
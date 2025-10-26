import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

// --- Import all page components with correct casing ---
import StudentsDashboard from "./pages/StudentsDashboard";
import TutorsDashboard from "./pages/TutorsDashboard";
import Leaderboard from "./pages/Leaderboard";
import FindTutors from "./pages/FindTutors";
import MyGigs from "./pages/MyGigs";
import ActiveSessions from "./pages/ActiveSessions";
import Marketplace from "./pages/Marketplace";
import RequestHub from "./pages/RequestHub";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import GlobalChat from "./pages/GlobalChat";
import Directory from "./pages/Directory";
import News from "./pages/News";
import Notifications from "./pages/Notifications";
import SessionChat from "./pages/SessionChat";
import MegaThreadView from "./pages/MegaThreadView";
import AdminPanel from "./pages/AdminPanel";

function HomePage() {
  return (
    <div className="text-center text-white text-3xl mt-12">
      Welcome to BigGrade 🚀
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout currentPageName="Home">
                <Routes>
                  {/* --- Main Routes --- */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/students-dashboard" element={<StudentsDashboard />} />
                  <Route path="/tutors-dashboard" element={<TutorsDashboard />} />
                  
                  {/* Discovery & Matching */}
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/find-tutors" element={<FindTutors />} />
                  <Route path="/directory" element={<Directory />} />
                  
                  {/* Gigs & Sessions */}
                  <Route path="/my-gigs" element={<MyGigs />} />
                  <Route path="/active-sessions" element={<ActiveSessions />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/request-hub" element={<RequestHub />} />
                  
                  {/* Profile */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/view-profile/:userId" element={<ViewProfile />} />
                  
                  {/* Communication */}
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/chat-list" element={<ChatList />} />
                  <Route path="/global-chat" element={<GlobalChat />} />
                  <Route path="/session-chat/:sessionId" element={<SessionChat />} />
                  
                  {/* Content */}
                  <Route path="/news" element={<News />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/megathread/:threadId" element={<MegaThreadView />} />
                  
                  {/* Admin */}
                  <Route path="/admin" element={<AdminPanel />} />
                  
                  {/* 404 Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}


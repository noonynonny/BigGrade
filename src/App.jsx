// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

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
        <Route path="/session-chat" element={<SessionChat />} />
        
        {/* Marketplace & Requests */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/request-hub" element={<RequestHub />} />
        
        {/* Communication */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat-list" element={<ChatList />} />
        <Route path="/global-chat" element={<GlobalChat />} />
        
        {/* Profile & User */}
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Content */}
        <Route path="/news" element={<News />} />
        <Route path="/megathread/:id" element={<MegaThreadView />} />
        
        {/* Admin */}
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* A catch-all route for pages that don't exist */}
        <Route path="*" element={
          <div className="text-center text-white mt-12">
            <h2 className="text-4xl font-black mb-4">404: PAGE NOT FOUND</h2>
            <p className="text-xl">The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
}


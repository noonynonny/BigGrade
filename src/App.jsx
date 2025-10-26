// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// --- Import all your page components with correct casing ---
// The file names in the repository are: StudentsDashboard.jsx, Leaderboard.jsx, FindTutors..jsx, MyGigs.jsx, ActiveSessions.jsx, Profile.jsx
import StudentsDashboard from "./pages/StudentsDashboard";
import Leaderboard from "./pages/Leaderboard";
import FindTutors from "./pages/FindTutors";
import MyGigs from "./pages/MyGigs";
import ActiveSessions from "./pages/ActiveSessions";
import Marketplace from "./pages/Marketplace.jsx";
import Profile from "./pages/Profile";

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
        {/* --- Add all your routes here --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/students-dashboard" element={<StudentsDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/find-tutors" element={<FindTutors />} />
        <Route path="/my-gigs" element={<MyGigs />} />
        <Route path="/active-sessions" element={<ActiveSessions />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* A catch-all route for pages that don't exist */}
        <Route path="*" element={<div><h2>404: Page Not Found</h2></div>} />
      </Routes>
    </Layout>
  );
}


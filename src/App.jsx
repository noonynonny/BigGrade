// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

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
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import Staff from "./pages/Staff";
import Documents from "./pages/Documents";
import Lessons from "./pages/Lessons";

function App() {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Login route */}
      <Route path="/login" element={<Login />} />
      {/* Add other routes here as needed */}
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/lessons" element={<Lessons />} />
    </Routes>
  );
}

export default App;

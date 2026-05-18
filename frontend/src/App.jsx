import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ManagePatientPage } from "./pages/ManagePatientPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  // Persistence for premium UX
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const saved = localStorage.getItem("caresync_admin");
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuth = (adminData) => {
    setCurrentAdmin(adminData);
    localStorage.setItem("caresync_admin", JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem("caresync_admin");
  };

  return (
    <BrowserRouter>
      {/* Toast notifications center */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: "font-semibold text-sm rounded-2xl px-4.5 py-3 shadow-lg shadow-slate-200/40 border border-slate-100",
          duration: 4000,
          success: {
            style: {
              background: "#ffffff",
              color: "#0f172a",
            },
            iconTheme: {
              primary: "#10b981", // Emerald 500
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#ffffff",
              color: "#0f172a",
            },
            iconTheme: {
              primary: "#f43f5e", // Rose 500
              secondary: "#ffffff",
            },
          },
          loading: {
            style: {
              background: "#ffffff",
              color: "#0f172a",
            },
          }
        }}
      />
      
      <Routes>
        {/* Public landing page */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={
            currentAdmin ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onAuth={handleAuth} />
            )
          } 
        />
        
        {/* Protected dashboard */}
        <Route 
          path="/dashboard" 
          element={
            currentAdmin ? (
              <DashboardPage currentAdmin={currentAdmin} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Protected manage patient */}
        <Route 
          path="/patient/:id" 
          element={
            currentAdmin ? (
              <ManagePatientPage currentAdmin={currentAdmin} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Protected profile */}
        <Route 
          path="/profile" 
          element={
            currentAdmin ? (
              <ProfilePage currentAdmin={currentAdmin} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

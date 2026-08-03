import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Entrance Gates */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Shield Protected Workspace Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Fallback Catch-All Router Target */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


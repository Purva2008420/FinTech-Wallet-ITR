import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Profile from "./pages/Profile";
import FraudReview from "./pages/FraudReview";
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
          <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path="/analytics" element={<AnalyticsDashboard />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/fraud-review" element={<ProtectedRoute adminOnly><FraudReview /></ProtectedRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


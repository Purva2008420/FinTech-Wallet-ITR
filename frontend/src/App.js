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
import AdminRoute from "./components/AdminRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
       <Routes>

    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Normal User Routes */}
    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />

    <Route
        path="/wallet"
        element={
            <ProtectedRoute>
                <Wallet />
            </ProtectedRoute>
        }
    />

    <Route
        path="/transfer"
        element={
            <ProtectedRoute>
                <Transfer />
            </ProtectedRoute>
        }
    />

    <Route
        path="/transactions"
        element={
            <ProtectedRoute>
                <Transactions />
            </ProtectedRoute>
        }
    />

    <Route
        path="/profile"
        element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        }
    />

    {/* Admin Routes */}
    <Route
        path="/admin"
        element={
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
        }
    />

    <Route
        path="/analytics"
        element={
            <AdminRoute>
                <AnalyticsDashboard />
            </AdminRoute>
        }
    />

    <Route
        path="/fraud-review"
        element={
            <AdminRoute>
                <FraudReview />
            </AdminRoute>
        }
    />

    {/* Catch-All */}
    <Route
        path="*"
        element={<Navigate to="/login" replace />}
    />

</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


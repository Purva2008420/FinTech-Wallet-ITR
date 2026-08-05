import React, { useEffect, useState } from "react";

import AdminStats from "../components/AdminStats";
import UserTable from "../components/UserTable";
import FraudAlertTable from "../components/FraudAlertTable";

import {
  getDashboardStats,
  getUsers,
  getFraudAlerts,
} from "../api/adminApi";

import "../styles/admin.css";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);

  const [users, setUsers] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ============================
  // Load Dashboard Statistics
  // ============================

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // Load Users
  // ============================

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      if (data.results) {
        setUsers(data.results);
      } else {
        setUsers(data);
      }

    } catch (error) {
      console.error(error);
      setError("Unable to load users.");
    }
  };

  // ============================
  // Load Fraud Alerts
  // ============================

  const loadFraudAlerts = async () => {
    try {

      const data = await getFraudAlerts();

      if (data.results) {
        setAlerts(data.results);
      } else {
        setAlerts(data);
      }

    } catch (error) {
      console.error(error);
      setError("Unable to load fraud alerts.");
    }
  };

  // ============================
  // Load Everything
  // ============================

  const loadDashboard = async () => {

    setLoading(true);

    await Promise.all([
      loadStats(),
      loadUsers(),
      loadFraudAlerts(),
    ]);

    setLoading(false);

  };

  useEffect(() => {
    loadDashboard();
  }, []);
    return (
    <div className="container mt-4">

      <div className="mb-4">
        <h2 className="fw-bold">
          Admin Dashboard
        </h2>

        <p className="text-muted">
          Monitor users, transactions and fraud alerts.
        </p>
      </div>

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
          </div>

          <p className="mt-3">
            Loading Dashboard...
          </p>

        </div>

      ) : error ? (

        <div className="alert alert-danger">
          {error}
        </div>

      ) : (

        <>

          {/* Statistics */}

          <AdminStats stats={stats} />

          {/* Users */}

          <UserTable
            users={users}
            refreshUsers={loadUsers}
          />

          {/* Fraud Alerts */}

          <FraudAlertTable
            alerts={alerts}
            refreshAlerts={loadFraudAlerts}
          />

        </>

      )}

    </div>
  );
};

export default AdminDashboard;
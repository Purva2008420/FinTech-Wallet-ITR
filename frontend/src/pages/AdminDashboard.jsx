import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================
    // Load Dashboard Statistics
    // ============================

    const loadStats = useCallback(async () => {

        try {

            const data = await getDashboardStats();

            setStats(data);

        } catch (error) {

            console.error("Dashboard stats error:", error);

            setError(
                "Unable to load dashboard statistics."
            );

        }

    }, []);

    // ============================
    // Load Users
    // ============================

    const loadUsers = useCallback(async () => {

        try {

            const data = await getUsers();

            if (data.results) {

                setUsers(data.results);

            } else {

                setUsers(data);

            }

        } catch (error) {

            console.error("Users error:", error);

            setError(
                "Unable to load users."
            );

        }

    }, []);

    // ============================
    // Load Fraud Alerts
    // ============================

    const loadFraudAlerts = useCallback(async () => {

        try {

            const data = await getFraudAlerts();

            if (data.results) {

                setAlerts(data.results);

            } else {

                setAlerts(data);

            }

        } catch (error) {

            console.error("Fraud alerts error:", error);

            setError(
                "Unable to load fraud alerts."
            );

        }

    }, []);

    // ============================
    // Load Everything
    // ============================

    const loadDashboard = useCallback(async () => {

        setLoading(true);
        setError("");

        await Promise.all([
            loadStats(),
            loadUsers(),
            loadFraudAlerts(),
        ]);

        setLoading(false);

    }, [
        loadStats,
        loadUsers,
        loadFraudAlerts
    ]);

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);

    // ============================
    // Loading
    // ============================

    if (loading) {

        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3 text-muted">
                    Loading administrator dashboard...
                </p>

            </div>
        );
    }

    // ============================
    // Dashboard
    // ============================

    return (

        <div className="container py-4 mb-5">

            {/* ============================
                Header
            ============================ */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        🛡️ Admin Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Monitor users, wallets, transactions and security activity.
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-primary fw-bold shadow-sm mt-3 mt-md-0"
                    onClick={() => navigate("/analytics")}
                >
                    📊 Analytics
                </button>

            </div>


            {/* ============================
                Error
            ============================ */}

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}


            {/* ============================
                Statistics
            ============================ */}

            <AdminStats
                stats={stats}
            />


            {/* ============================
                Quick Operations
            ============================ */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "18px"
                }}
            >

                <div className="card-body p-4">

                    <div className="mb-3">

                        <h5 className="fw-bold mb-1">
                            ⚡ Quick Operations
                        </h5>

                        <p className="text-muted small mb-0">
                            Quickly access important administrator functions.
                        </p>

                    </div>


                    <div className="row g-3">

                        {/* Manage Users */}

                        <div className="col-md-6 col-lg-3">

                            <button
                                type="button"
                                className="admin-operation-card w-100"
                                onClick={() => {
                                    document
                                        .getElementById("user-management")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >

                                <div className="admin-operation-icon">
                                    👥
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Manage Users
                                    </h6>

                                    <small className="text-muted">
                                        View and manage accounts
                                    </small>
                                </div>

                            </button>

                        </div>


                        {/* Fraud Alerts */}

                        <div className="col-md-6 col-lg-3">

                            <button
                                type="button"
                                className="admin-operation-card w-100"
                                onClick={() => {
                                    document
                                        .getElementById("fraud-alerts")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >

                                <div className="admin-operation-icon">
                                    🚨
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Fraud Alerts
                                    </h6>

                                    <small className="text-muted">
                                        Review security alerts
                                    </small>
                                </div>

                            </button>

                        </div>


                        {/* Analytics */}

                        <div className="col-md-6 col-lg-3">

                            <button
                                type="button"
                                className="admin-operation-card w-100"
                                onClick={() => navigate("/analytics")}
                            >

                                <div className="admin-operation-icon">
                                    📊
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Analytics
                                    </h6>

                                    <small className="text-muted">
                                        View financial analytics
                                    </small>
                                </div>

                            </button>

                        </div>


                        {/* Profile */}

                        <div className="col-md-6 col-lg-3">

                            <button
                                type="button"
                                className="admin-operation-card w-100"
                                onClick={() => navigate("/profile")}
                            >

                                <div className="admin-operation-icon">
                                    👤
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1">
                                        My Profile
                                    </h6>

                                    <small className="text-muted">
                                        Manage administrator profile
                                    </small>
                                </div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ============================
                Recent Transactions
            ============================ */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "18px"
                }}
            >

                <div className="card-header bg-white border-0 p-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="fw-bold mb-1">
                                📜 Recent Transactions
                            </h5>

                            <p className="text-muted small mb-0">
                                Latest financial activity across the system.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm fw-bold"
                            onClick={() => navigate("/transactions")}
                        >
                            View Transactions →
                        </button>

                    </div>

                </div>


                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th className="ps-4">
                                        ID
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {!stats?.latest_transactions ||
                                stats.latest_transactions.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-4"
                                        >
                                            No recent transactions found.
                                        </td>

                                    </tr>

                                ) : (

                                    stats.latest_transactions.map(
                                        (transaction) => (

                                            <tr key={transaction.id}>

                                                <td className="ps-4 fw-semibold">
                                                    #{transaction.id}
                                                </td>

                                                <td>

                                                    <span className="fw-semibold">

                                                        {transaction.transaction_type ||
                                                            "Transaction"}

                                                    </span>

                                                </td>

                                                <td className="fw-bold">

                                                    ₹
                                                    {Number(
                                                        transaction.amount || 0
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}

                                                </td>

                                                <td>

                                                    {transaction.status ===
                                                    "SUCCESS" ? (

                                                        <span className="badge bg-success">
                                                            ✓ SUCCESS
                                                        </span>

                                                    ) : transaction.status ===
                                                      "FAILED" ? (

                                                        <span className="badge bg-danger">
                                                            ✕ FAILED
                                                        </span>

                                                    ) : transaction.status ===
                                                      "PENDING" ? (

                                                        <span className="badge bg-warning text-dark">
                                                            🟡 PENDING
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-secondary">
                                                            {transaction.status ||
                                                                "UNKNOWN"}
                                                        </span>

                                                    )}

                                                </td>

                                                <td className="text-muted small">

                                                    {transaction.created_at
                                                        ? new Date(
                                                            transaction.created_at
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )
                                                        : "-"}

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* ============================
                User Management
            ============================ */}

            <div id="user-management">

                <UserTable
                    users={users}
                    refreshUsers={loadUsers}
                />

            </div>


            {/* ============================
                Fraud Alerts
            ============================ */}

            <div id="fraud-alerts">

                <FraudAlertTable
                    alerts={alerts}
                    refreshAlerts={loadFraudAlerts}
                />

            </div>

        </div>

    );
};

export default AdminDashboard;
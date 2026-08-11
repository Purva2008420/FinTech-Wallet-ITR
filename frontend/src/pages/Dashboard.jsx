import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState({
        balance: "0.00",
        transactionsCount: 0,
    });

    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const walletRes = await api.get("wallet/");
                const txRes = await api.get("transactions/");

                const logs = txRes.data.results || txRes.data;

                const transactionList = Array.isArray(logs)
                    ? logs
                    : [];

                setStats({
                    balance: walletRes.data.balance,
                    transactionsCount:
                        txRes.data.count ?? transactionList.length,
                });

                setRecentTransactions(
                    transactionList.slice(0, 5)
                );

            } catch (err) {
                console.error(
                    "Error fetching dashboard data:",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ==========================================
    // Status Badge
    // ==========================================

    const getStatusBadge = (status) => {
        switch (status) {
            case "SUCCESS":
                return (
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                        ✓ Successful
                    </span>
                );

            case "PENDING":
                return (
                    <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2">
                        🟡 Pending
                    </span>
                );

            case "FAILED":
                return (
                    <span className="badge bg-danger-subtle text-danger px-3 py-2">
                        ✕ Failed
                    </span>
                );

            default:
                return (
                    <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    // ==========================================
    // Transaction Type
    // ==========================================

    const getTransactionType = (type) => {
        switch (type) {
            case "DEPOSIT":
                return {
                    label: "Deposit",
                    icon: "⬇️",
                    className: "text-success",
                };

            case "WITHDRAW":
                return {
                    label: "Withdrawal",
                    icon: "⬆️",
                    className: "text-danger",
                };

            case "TRANSFER":
                return {
                    label: "Transfer",
                    icon: "🔄",
                    className: "text-primary",
                };

            default:
                return {
                    label: type || "Transaction",
                    icon: "💳",
                    className: "text-secondary",
                };
        }
    };

    // ==========================================
    // Amount Display
    // ==========================================

    const getAmountDisplay = (tx) => {
        const amount = Number(tx.amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

        if (tx.transaction_type === "DEPOSIT") {
            return (
                <span className="text-success fw-bold">
                    + ₹{amount}
                </span>
            );
        }

        if (tx.transaction_type === "WITHDRAW") {
            return (
                <span className="text-danger fw-bold">
                    − ₹{amount}
                </span>
            );
        }

        if (tx.transaction_type === "TRANSFER") {
            return (
                <span className="text-primary fw-bold">
                    ₹{amount}
                </span>
            );
        }

        return (
            <span className="fw-bold">
                ₹{amount}
            </span>
        );
    };

    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return new Date(dateString).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ==========================================
    // Loading Screen
    // ==========================================

    if (loading) {
        return (
            <div>
                <Navbar />

                <div className="container py-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <h5 className="mt-3 fw-semibold">
                        Loading your financial dashboard...
                    </h5>

                    <p className="text-muted">
                        Syncing your wallet and transaction data.
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div>

            <Navbar />

            <div className="container py-3 pb-5">

                {/* ==========================================
                    Welcome Header
                ========================================== */}

                <div className="mb-4">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                        <div>

                            <p className="text-primary fw-semibold mb-1">
                                FINTECH VAULT
                            </p>

                            <h2 className="fw-bold mb-1">
                                Welcome back, {user?.username}! 👋
                            </h2>

                            <p className="text-muted mb-0">
                                Here's your financial activity at a glance.
                            </p>

                        </div>

                        <div className="text-md-end">

                            <span className="badge bg-success-subtle text-success px-3 py-2">
                                ● Account Active
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    Main Balance Card
                ========================================== */}

                <div
                    className="card border-0 shadow-lg text-white mb-4 overflow-hidden"
                    style={{
                        borderRadius: "22px",
                        background:
                            "linear-gradient(135deg, #0d6efd 0%, #274c9b 55%, #182848 100%)",
                    }}
                >

                    <div className="card-body p-4 p-md-5">

                        <div className="row align-items-center">

                            <div className="col-md-7">

                                <div className="d-flex align-items-center gap-2 mb-3">

                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            background:
                                                "rgba(255,255,255,0.15)",
                                        }}
                                    >
                                        💳
                                    </span>

                                    <span className="small text-white-50 fw-semibold">
                                        AVAILABLE WALLET BALANCE
                                    </span>

                                </div>

                                <h1
                                    className="fw-bold mb-2"
                                    style={{
                                        fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                                    }}
                                >
                                    ₹
                                    {Number(
                                        stats.balance || 0
                                    ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </h1>

                                <p className="text-white-50 mb-0">
                                    Your available digital wallet balance
                                </p>

                            </div>


                            <div className="col-md-5 mt-4 mt-md-0">

                                <div
                                    className="p-4 rounded-4"
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.10)",
                                        border:
                                            "1px solid rgba(255,255,255,0.15)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >

                                    <div className="d-flex justify-content-between mb-3">

                                        <span className="text-white-50 small">
                                            Wallet Status
                                        </span>

                                        <span className="badge bg-success">
                                            Active
                                        </span>

                                    </div>

                                    <div className="d-flex justify-content-between">

                                        <span className="text-white-50 small">
                                            Transactions
                                        </span>

                                        <strong>
                                            {stats.transactionsCount}
                                        </strong>

                                    </div>

                                    <hr
                                        style={{
                                            borderColor:
                                                "rgba(255,255,255,0.15)",
                                        }}
                                    />

                                    <div className="d-flex justify-content-between">

                                        <span className="text-white-50 small">
                                            Security
                                        </span>

                                        <strong>
                                            🛡️ Protected
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>


                {/* ==========================================
                    Quick Actions
                ========================================== */}

                <div className="mb-4">

                    <div className="mb-3">

                        <h5 className="fw-bold mb-1">
                            Quick Actions
                        </h5>

                        <p className="text-muted small mb-0">
                            Manage your money quickly and securely.
                        </p>

                    </div>

                    <div className="row g-3">

                        <div className="col-6 col-md-3">

                            <Link
                                to="/wallet"
                                className="text-decoration-none"
                            >

                                <div
                                    className="card border-0 shadow-sm h-100 text-center p-3"
                                    style={{
                                        borderRadius: "16px",
                                    }}
                                >

                                    <div
                                        className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            fontSize: "24px",
                                        }}
                                    >
                                        ➕
                                    </div>

                                    <h6 className="fw-bold text-dark mb-1">
                                        Add Money
                                    </h6>

                                    <small className="text-muted">
                                        Load your wallet
                                    </small>

                                </div>

                            </Link>

                        </div>


                        <div className="col-6 col-md-3">

                            <Link
                                to="/wallet"
                                className="text-decoration-none"
                            >

                                <div
                                    className="card border-0 shadow-sm h-100 text-center p-3"
                                    style={{
                                        borderRadius: "16px",
                                    }}
                                >

                                    <div
                                        className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            fontSize: "24px",
                                        }}
                                    >
                                        ⬆️
                                    </div>

                                    <h6 className="fw-bold text-dark mb-1">
                                        Withdraw
                                    </h6>

                                    <small className="text-muted">
                                        Withdraw funds
                                    </small>

                                </div>

                            </Link>

                        </div>


                        <div className="col-6 col-md-3">

                            <Link
                                to="/transfer"
                                className="text-decoration-none"
                            >

                                <div
                                    className="card border-0 shadow-sm h-100 text-center p-3"
                                    style={{
                                        borderRadius: "16px",
                                    }}
                                >

                                    <div
                                        className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-info-subtle"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            fontSize: "24px",
                                        }}
                                    >
                                        💸
                                    </div>

                                    <h6 className="fw-bold text-dark mb-1">
                                        Transfer
                                    </h6>

                                    <small className="text-muted">
                                        Send money
                                    </small>

                                </div>

                            </Link>

                        </div>


                        <div className="col-6 col-md-3">

                            <Link
                                to="/transactions"
                                className="text-decoration-none"
                            >

                                <div
                                    className="card border-0 shadow-sm h-100 text-center p-3"
                                    style={{
                                        borderRadius: "16px",
                                    }}
                                >

                                    <div
                                        className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            fontSize: "24px",
                                        }}
                                    >
                                        📜
                                    </div>

                                    <h6 className="fw-bold text-dark mb-1">
                                        Transactions
                                    </h6>

                                    <small className="text-muted">
                                        View statement
                                    </small>

                                </div>

                            </Link>

                        </div>

                    </div>
                </div>


                {/* ==========================================
                    Overview Cards
                ========================================== */}

                <div className="row g-3 mb-4">

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "16px" }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <span className="text-muted small fw-semibold">
                                            TOTAL TRANSACTIONS
                                        </span>

                                        <h3 className="fw-bold mt-2 mb-1">
                                            {stats.transactionsCount}
                                        </h3>

                                        <small className="text-muted">
                                            Recorded on your account
                                        </small>

                                    </div>

                                    <span
                                        className="rounded-3 bg-primary-subtle p-3"
                                        style={{ fontSize: "22px" }}
                                    >
                                        📊
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "16px" }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <span className="text-muted small fw-semibold">
                                            ACCOUNT STATUS
                                        </span>

                                        <h3 className="fw-bold text-success mt-2 mb-1">
                                            Active
                                        </h3>

                                        <small className="text-success">
                                            ✓ Account operating normally
                                        </small>

                                    </div>

                                    <span
                                        className="rounded-3 bg-success-subtle p-3"
                                        style={{ fontSize: "22px" }}
                                    >
                                        ✓
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "16px" }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <span className="text-muted small fw-semibold">
                                            FRAUD SHIELD
                                        </span>

                                        <h3 className="fw-bold text-info mt-2 mb-1">
                                            Online
                                        </h3>

                                        <small className="text-muted">
                                            🛡️ Transaction monitoring active
                                        </small>

                                    </div>

                                    <span
                                        className="rounded-3 bg-info-subtle p-3"
                                        style={{ fontSize: "22px" }}
                                    >
                                        🛡️
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    Recent Transactions
                ========================================== */}

                <div
                    className="card border-0 shadow-sm mb-4 overflow-hidden"
                    style={{ borderRadius: "18px" }}
                >

                    <div className="card-header bg-white border-0 p-4">

                        <div className="d-flex justify-content-between align-items-center gap-3">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    📜 Recent Transactions
                                </h5>

                                <p className="text-muted small mb-0">
                                    Your latest financial activity.
                                </p>

                            </div>

                            <Link
                                to="/transactions"
                                className="btn btn-outline-primary btn-sm fw-semibold"
                            >
                                View All →
                            </Link>

                        </div>

                    </div>


                    <div className="card-body p-0">

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>
                                        <th className="ps-4">
                                            Transaction
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th className="pe-4">
                                            Date
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {recentTransactions.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="text-center py-5"
                                            >

                                                <div
                                                    style={{
                                                        fontSize: "35px",
                                                    }}
                                                >
                                                    📭
                                                </div>

                                                <h6 className="fw-bold mt-2">
                                                    No transactions yet
                                                </h6>

                                                <p className="text-muted small mb-0">
                                                    Your recent activity will
                                                    appear here.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        recentTransactions.map((tx) => {

                                            const type =
                                                getTransactionType(
                                                    tx.transaction_type
                                                );

                                            return (
                                                <tr key={tx.id}>

                                                    <td className="ps-4">

                                                        <div className="d-flex align-items-center gap-3">

                                                            <div
                                                                className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                                                                style={{
                                                                    width: "42px",
                                                                    height: "42px",
                                                                    fontSize: "18px",
                                                                }}
                                                            >
                                                                {type.icon}
                                                            </div>

                                                            <div>

                                                                <div
                                                                    className={`fw-bold ${type.className}`}
                                                                >
                                                                    {type.label}
                                                                </div>

                                                                <small className="text-muted">
                                                                    Transaction #
                                                                    {tx.id}
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        {getAmountDisplay(tx)}
                                                    </td>


                                                    <td>
                                                        {getStatusBadge(
                                                            tx.status
                                                        )}
                                                    </td>


                                                    <td className="pe-4 text-muted small">
                                                        {formatDate(
                                                            tx.created_at
                                                        )}
                                                    </td>

                                                </tr>
                                            );
                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    Security Center
                ========================================== */}

                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{
                        borderRadius: "18px",
                        background:
                            "linear-gradient(135deg, #f8f9fa, #eef4ff)",
                    }}
                >

                    <div className="card-body p-4">

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    🔐 Security Center
                                </h5>

                                <p className="text-muted small mb-0">
                                    Your FinTech Vault account is protected
                                    by multiple security controls.
                                </p>

                            </div>

                            <span className="badge bg-success px-3 py-2">
                                🛡️ Protected
                            </span>

                        </div>

                        <hr />

                        <div className="row text-center">

                            <div className="col-md-4 mb-4 mb-md-0">

                                <div className="fs-3 mb-2">
                                    🔑
                                </div>

                                <h6 className="fw-bold">
                                    Secure Authentication
                                </h6>

                                <p className="text-muted small mb-0">
                                    JWT-based authentication protects
                                    your account.
                                </p>

                            </div>


                            <div className="col-md-4 mb-4 mb-md-0">

                                <div className="fs-3 mb-2">
                                    🛡️
                                </div>

                                <h6 className="fw-bold">
                                    Fraud Monitoring
                                </h6>

                                <p className="text-muted small mb-0">
                                    Transactions are monitored for
                                    suspicious activity.
                                </p>

                            </div>


                            <div className="col-md-4">

                                <div className="fs-3 mb-2">
                                    👤
                                </div>

                                <h6 className="fw-bold">
                                    Account Security
                                </h6>

                                <p className="text-muted small mb-2">
                                    Keep your profile information updated.
                                </p>

                                <Link
                                    to="/profile"
                                    className="btn btn-sm btn-outline-primary fw-semibold"
                                >
                                    Manage Profile
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    Bottom Navigation
                ========================================== */}

                <div className="row g-3">

                    <div className="col-md-4">

                        <Link
                            to="/wallet"
                            className="text-decoration-none"
                        >

                            <div
                                className="card border-0 shadow-sm p-4 text-center h-100"
                                style={{
                                    borderRadius: "16px",
                                }}
                            >

                                <div className="fs-2 mb-2">
                                    💳
                                </div>

                                <h6 className="fw-bold text-dark">
                                    Wallet
                                </h6>

                                <small className="text-muted">
                                    Manage your funds
                                </small>

                            </div>

                        </Link>

                    </div>


                    <div className="col-md-4">

                        <Link
                            to="/transfer"
                            className="text-decoration-none"
                        >

                            <div
                                className="card border-0 shadow-sm p-4 text-center h-100"
                                style={{
                                    borderRadius: "16px",
                                }}
                            >

                                <div className="fs-2 mb-2">
                                    💸
                                </div>

                                <h6 className="fw-bold text-dark">
                                    Transfer
                                </h6>

                                <small className="text-muted">
                                    Send money securely
                                </small>

                            </div>

                        </Link>

                    </div>


                    <div className="col-md-4">

                        <Link
                            to="/profile"
                            className="text-decoration-none"
                        >

                            <div
                                className="card border-0 shadow-sm p-4 text-center h-100"
                                style={{
                                    borderRadius: "16px",
                                }}
                            >

                                <div className="fs-2 mb-2">
                                    👤
                                </div>

                                <h6 className="fw-bold text-dark">
                                    Profile
                                </h6>

                                <small className="text-muted">
                                    Manage account settings
                                </small>

                            </div>

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;



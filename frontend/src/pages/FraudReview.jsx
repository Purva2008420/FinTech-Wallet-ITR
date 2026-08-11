import React, { useEffect, useState } from "react";
import api from "../api/axios";

import "../styles/fraud-review.css";

const FraudReview = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    // =========================
    // Fetch Pending Transactions
    // =========================

    const fetchPendingTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "fraud-alerts/pending/"
            );

            setPendingTransactions(
                response.data.pending_transactions || []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Unable to load pending transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTransactions();
    }, []);

    // =========================
    // Severity Badge
    // =========================

    const getSeverityClass = (severity) => {
        switch (severity?.toUpperCase()) {
            case "HIGH":
                return "fraud-severity-high";

            case "MEDIUM":
                return "fraud-severity-medium";

            case "LOW":
                return "fraud-severity-low";

            default:
                return "fraud-severity-default";
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity?.toUpperCase()) {
            case "HIGH":
                return "🔴";

            case "MEDIUM":
                return "🟠";

            case "LOW":
                return "🟢";

            default:
                return "⚠️";
        }
    };

    // =========================
    // Review Transaction
    // =========================

    const reviewTransaction = async (
        transactionId,
        action
    ) => {

        const actionText =
            action === "approve"
                ? "APPROVE"
                : "REJECT";

        const confirmed = window.confirm(
            `Are you sure you want to ${actionText} transaction #${transactionId}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingId(transactionId);
            setMessage("");
            setError("");

            const response = await api.post(
                `fraud-alerts/pending/${transactionId}/${action}/`,
                {}
            );

            setMessage(
                response.data.message ||
                `Transaction #${transactionId} reviewed successfully.`
            );

            // Remove reviewed transaction
            setPendingTransactions((current) =>
                current.filter(
                    (transaction) =>
                        transaction.id !== transactionId
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.error ||
                "Unable to review transaction."
            );

        } finally {
            setProcessingId(null);
        }
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="fraud-review-page container py-5">

                <div className="fraud-loading-card">

                    <div className="spinner-border text-danger" />

                    <h5 className="mt-3 fw-bold">
                        Loading Fraud Review Center
                    </h5>

                    <p className="text-muted mb-0">
                        Checking for transactions requiring security review...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="fraud-review-page container py-4">

            {/* =========================
                Header
            ========================= */}

            <div className="fraud-page-header">

                <div>

                    <div className="fraud-title-wrapper">

                        <div className="fraud-title-icon">
                            🛡️
                        </div>

                        <div>

                            <h2 className="fw-bold mb-1">
                                Fraud Review Center
                            </h2>

                            <p className="text-muted mb-0">
                                Review transactions flagged by the security system.
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    className="btn btn-outline-primary fw-semibold"
                    onClick={fetchPendingTransactions}
                    disabled={loading}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* =========================
                Messages
            ========================= */}

            {message && (
                <div className="alert alert-success fraud-message shadow-sm">
                    <strong>✅ Success</strong>
                    <div>{message}</div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger fraud-message shadow-sm">
                    <strong>⚠️ Error</strong>
                    <div>{error}</div>
                </div>
            )}

            {/* =========================
                Summary
            ========================= */}

            <div className="row g-3 mb-4">

                <div className="col-md-4">

                    <div className="fraud-summary-card pending">

                        <div className="fraud-summary-icon">
                            🟡
                        </div>

                        <div>

                            <small>
                                Pending Reviews
                            </small>

                            <h3>
                                {pendingTransactions.length}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="fraud-summary-card security">

                        <div className="fraud-summary-icon">
                            🛡️
                        </div>

                        <div>

                            <small>
                                Security Status
                            </small>

                            <h3>
                                Active
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="fraud-summary-card review">

                        <div className="fraud-summary-icon">
                            🔍
                        </div>

                        <div>

                            <small>
                                Review Mode
                            </small>

                            <h3>
                                Manual
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                Empty State
            ========================= */}

            {pendingTransactions.length === 0 ? (

                <div className="fraud-empty-card">

                    <div className="fraud-empty-icon">
                        🛡️
                    </div>

                    <h4 className="fw-bold">
                        No Pending Transactions
                    </h4>

                    <p className="text-muted mb-4">
                        The security system currently has no
                        transactions waiting for manual review.
                    </p>

                    <button
                        className="btn btn-outline-primary"
                        onClick={fetchPendingTransactions}
                    >
                        🔄 Check Again
                    </button>

                </div>

            ) : (

                <>

                    {/* Review Notice */}

                    <div className="fraud-review-notice">

                        <div className="notice-icon">
                            ⚠️
                        </div>

                        <div>

                            <strong>
                                Transactions Require Attention
                            </strong>

                            <p className="mb-0">
                                {pendingTransactions.length} transaction
                                {pendingTransactions.length !== 1
                                    ? "s are"
                                    : " is"}{" "}
                                currently waiting for manual security review.
                            </p>

                        </div>

                    </div>

                    {/* =========================
                        Transaction Cards
                    ========================= */}

                    <div className="row g-4">

                        {pendingTransactions.map(
                            (transaction) => {

                                const firstAlert =
                                    transaction.fraud_alerts?.[0];

                                const severity =
                                    firstAlert?.severity || "UNKNOWN";

                                return (

                                    <div
                                        className="col-xl-6"
                                        key={transaction.id}
                                    >

                                        <div className="fraud-transaction-card">

                                            {/* Card Header */}

                                            <div className="fraud-card-header">

                                                <div>

                                                    <small>
                                                        TRANSACTION
                                                    </small>

                                                    <h5 className="fw-bold mb-0">
                                                        #{transaction.id}
                                                    </h5>

                                                </div>

                                                <span className="fraud-pending-badge">
                                                    🟡 PENDING
                                                </span>

                                            </div>

                                            {/* Amount */}

                                            <div className="fraud-amount-section">

                                                <small>
                                                    Transaction Amount
                                                </small>

                                                <h1>
                                                    ₹
                                                    {Number(
                                                        transaction.amount || 0
                                                    ).toLocaleString("en-IN", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </h1>

                                            </div>

                                            {/* Details */}

                                            <div className="fraud-details-grid">

                                                <div className="fraud-detail">

                                                    <span>
                                                        Sender
                                                    </span>

                                                    <strong>
                                                        👤{" "}
                                                        {transaction.sender ||
                                                            "N/A"}
                                                    </strong>

                                                </div>

                                                <div className="fraud-detail">

                                                    <span>
                                                        Receiver
                                                    </span>

                                                    <strong>
                                                        👤{" "}
                                                        {transaction.receiver ||
                                                            "N/A"}
                                                    </strong>

                                                </div>

                                                <div className="fraud-detail">

                                                    <span>
                                                        Transaction Type
                                                    </span>

                                                    <strong>
                                                        {transaction.transaction_type ||
                                                            "TRANSFER"}
                                                    </strong>

                                                </div>

                                                <div className="fraud-detail">

                                                    <span>
                                                        Transaction ID
                                                    </span>

                                                    <strong>
                                                        #{transaction.id}
                                                    </strong>

                                                </div>

                                            </div>

                                            {/* Description */}

                                            <div className="fraud-description">

                                                <span>
                                                    Description
                                                </span>

                                                <p>
                                                    {transaction.description ||
                                                        "No description provided."}
                                                </p>

                                            </div>

                                            {/* Fraud Alert */}

                                            {transaction.fraud_alerts?.length >
                                                0 && (

                                                <div className="fraud-alert-section">

                                                    <div className="fraud-alert-title">

                                                        <strong>
                                                            🚨 Security Alert
                                                        </strong>

                                                    </div>

                                                    {transaction.fraud_alerts.map(
                                                        (alert) => (

                                                            <div
                                                                className="fraud-alert-item"
                                                                key={alert.id}
                                                            >

                                                                <div className="d-flex justify-content-between align-items-center mb-2">

                                                                    <span
                                                                        className={`fraud-severity-badge ${getSeverityClass(
                                                                            alert.severity
                                                                        )}`}
                                                                    >
                                                                        {getSeverityIcon(
                                                                            alert.severity
                                                                        )}{" "}
                                                                        {alert.severity ||
                                                                            "UNKNOWN"}
                                                                    </span>

                                                                    <span className="badge bg-dark">
                                                                        REVIEW
                                                                    </span>

                                                                </div>

                                                                <p className="mb-0">
                                                                    {alert.reason ||
                                                                        "Suspicious activity detected."}
                                                                </p>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                            {/* Actions */}

                                            <div className="fraud-actions">

                                                <button
                                                    className="btn btn-success fw-bold"
                                                    disabled={
                                                        processingId ===
                                                        transaction.id
                                                    }
                                                    onClick={() =>
                                                        reviewTransaction(
                                                            transaction.id,
                                                            "approve"
                                                        )
                                                    }
                                                >
                                                    {processingId ===
                                                    transaction.id
                                                        ? "Processing..."
                                                        : "✓ Approve Transaction"}
                                                </button>

                                                <button
                                                    className="btn btn-danger fw-bold"
                                                    disabled={
                                                        processingId ===
                                                        transaction.id
                                                    }
                                                    onClick={() =>
                                                        reviewTransaction(
                                                            transaction.id,
                                                            "reject"
                                                        )
                                                    }
                                                >
                                                    {processingId ===
                                                    transaction.id
                                                        ? "Processing..."
                                                        : "✕ Reject Transaction"}
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                </>
            )}

        </div>
    );
};

export default FraudReview;
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const FraudReview = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchPendingTransactions = async () => {
        try {
            setLoading(true);
            setError("");

           const response = await api.get("fraud-alerts/pending/");

            setPendingTransactions(
                response.data.pending_transactions || []
            );

        } catch (err) {
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

    const reviewTransaction = async (transactionId, action) => {
        const actionText = action === "approve" ? "APPROVE" : "REJECT";

const confirmed = window.confirm(
    `Are you sure you want to ${actionText} transaction #${transactionId}?`
);

if (!confirmed) return;
        try {

            setMessage("");
            setError("");

        const response = await api.post(
    `fraud-alerts/pending/${transactionId}/${action}/`,
    {}
);

            setMessage(response.data.message);

            // Remove the reviewed transaction from the list
            setPendingTransactions((current) =>
                current.filter(
                    (transaction) =>
                        transaction.id !== transactionId
                )
            );

        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to review transaction."
            );
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <h2>Pending Transaction Review</h2>
                <p>Loading pending transactions...</p>
            </div>
        );
    }

    return (
    <div className="container mt-4">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 className="fw-bold mb-1">
                    🛡️ Fraud Review Center
                </h2>
                <p className="text-muted mb-0">
                    Review and manage transactions flagged for security review.
                </p>
            </div>

            <button
                className="btn btn-outline-primary"
                onClick={fetchPendingTransactions}
                disabled={loading}
            >
                🔄 Refresh
            </button>
        </div>

        {/* Success Message */}
        {message && (
            <div className="alert alert-success shadow-sm">
                ✅ {message}
            </div>
        )}

        {/* Error Message */}
        {error && (
            <div className="alert alert-danger shadow-sm">
                ⚠️ {error}
            </div>
        )}

        {/* Empty State */}
        {pendingTransactions.length === 0 ? (
            <div className="card shadow-sm border-0">
                <div className="card-body text-center py-5">

                    <div className="display-4 mb-3">
                        🛡️
                    </div>

                    <h4 className="fw-bold">
                        No Pending Transactions
                    </h4>

                    <p className="text-muted mb-0">
                        There are currently no transactions waiting
                        for fraud review.
                    </p>

                </div>
            </div>
        ) : (
            <>
                {/* Summary */}
                <div className="alert alert-warning shadow-sm">
                    <strong>
                        🟡 {pendingTransactions.length}
                    </strong>{" "}
                    transaction
                    {pendingTransactions.length !== 1 ? "s" : ""}{" "}
                    waiting for review.
                </div>

                {/* Transaction Cards */}
                <div className="row">

                    {pendingTransactions.map((transaction) => (

                        <div
                            className="col-lg-6 mb-4"
                            key={transaction.id}
                        >

                            <div className="card shadow-sm h-100 border-0">

                                {/* Card Header */}
                                <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                                    <strong>
                                        Transaction #{transaction.id}
                                    </strong>

                                    <span className="badge bg-dark">
                                        PENDING
                                    </span>
                                </div>

                                <div className="card-body">

                                    {/* Amount */}
                                    <div className="mb-4">
                                        <small className="text-muted">
                                            Transaction Amount
                                        </small>

                                        <h2 className="fw-bold mb-0">
                                            ₹{transaction.amount}
                                        </h2>
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="mb-3">

                                        <p className="mb-2">
                                            <strong>From:</strong>{" "}
                                            {transaction.sender || "N/A"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>To:</strong>{" "}
                                            {transaction.receiver || "N/A"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Description:</strong>{" "}
                                            {transaction.description || "N/A"}
                                        </p>

                                    </div>

                                    {/* Fraud Alerts */}
                                    {transaction.fraud_alerts?.length > 0 && (
                                        <div className="mt-3">

                                            <h6 className="fw-bold">
                                                ⚠️ Fraud Alerts
                                            </h6>

                                            {transaction.fraud_alerts.map(
                                                (alert) => (
                                                    <div
                                                        key={alert.id}
                                                        className="alert alert-warning mb-2"
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center">

                                                            <strong>
                                                                {alert.severity}
                                                            </strong>

                                                            <span className="badge bg-warning text-dark">
                                                                REVIEW
                                                            </span>

                                                        </div>

                                                        <div className="mt-1">
                                                            {alert.reason}
                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 mt-4">

                                        <button
                                            className="btn btn-success flex-grow-1 fw-bold"
                                            onClick={() =>
                                                reviewTransaction(
                                                    transaction.id,
                                                    "approve"
                                                )
                                            }
                                        >
                                            ✓ Approve
                                        </button>

                                        <button
                                            className="btn btn-danger flex-grow-1 fw-bold"
                                            onClick={() =>
                                                reviewTransaction(
                                                    transaction.id,
                                                    "reject"
                                                )
                                            }
                                        >
                                            ✕ Reject
                                        </button>

                                    </div>

                                </div>
                            </div>

                        </div>

                    ))}

                </div>
            </>
        )}

    </div>
);
};

export default FraudReview;
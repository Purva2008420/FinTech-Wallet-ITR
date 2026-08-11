import React, { useState } from "react";
import { resolveFraudAlert } from "../api/adminApi";

const FraudAlertTable = ({ alerts, refreshAlerts }) => {
    const [message, setMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    // Safely handle missing data
    const alertList = Array.isArray(alerts) ? alerts : [];

    // ==========================
    // Resolve Fraud Alert
    // ==========================

    const handleResolve = async (id) => {
        setLoadingId(id);
        setMessage("");

        try {
            await resolveFraudAlert(id);

            setMessage("Fraud alert resolved successfully.");

            await refreshAlerts();

        } catch (error) {
            console.error("Resolve fraud alert error:", error);

            setMessage(
                "Failed to resolve fraud alert. Please try again."
            );

        } finally {
            setLoadingId(null);
        }
    };

    // ==========================
    // Severity Badge
    // ==========================

    const getSeverityBadge = (severity) => {
        switch (severity?.toUpperCase()) {

            case "HIGH":
                return (
                    <span className="badge bg-danger px-3 py-2">
                        🔴 HIGH
                    </span>
                );

            case "MEDIUM":
                return (
                    <span className="badge bg-warning text-dark px-3 py-2">
                        🟡 MEDIUM
                    </span>
                );

            case "LOW":
                return (
                    <span className="badge bg-success px-3 py-2">
                        🟢 LOW
                    </span>
                );

            default:
                return (
                    <span className="badge bg-secondary px-3 py-2">
                        {severity || "UNKNOWN"}
                    </span>
                );
        }
    };

    // ==========================
    // Status Badge
    // ==========================

    const getStatusBadge = (isResolved) => {

        if (isResolved) {
            return (
                <span className="badge bg-success px-3 py-2">
                    ✓ Resolved
                </span>
            );
        }

        return (
            <span className="badge bg-warning text-dark px-3 py-2">
                ● Pending
            </span>
        );
    };

    return (
        <div
            className="card border-0 shadow-sm mt-4"
            style={{ borderRadius: "16px" }}
        >

            {/* ==========================
                Header
            ========================== */}

            <div
                className="card-header border-0 text-white p-4"
                style={{
                    borderRadius: "16px 16px 0 0",
                    background:
                        "linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)",
                }}
            >

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

                    <div>

                        <h5 className="fw-bold mb-1">
                            🚨 Fraud Alerts
                        </h5>

                        <p className="mb-0 small text-white-50">
                            Monitor and resolve suspicious transaction activity.
                        </p>

                    </div>

                    <span className="badge bg-light text-danger px-3 py-2">
                        {alertList.length} Alert
                        {alertList.length !== 1 ? "s" : ""}
                    </span>

                </div>

            </div>


            {/* ==========================
                Body
            ========================== */}

            <div className="card-body p-4">

                {/* Message */}

                {message && (
                    <div
                        className="alert alert-info py-2 text-center small fw-semibold"
                    >
                        {message}
                    </div>
                )}


                {/* ==========================
                    Empty State
                ========================== */}

                {alertList.length === 0 ? (

                    <div className="text-center py-5">

                        <div
                            className="mb-3"
                            style={{ fontSize: "42px" }}
                        >
                            🛡️
                        </div>

                        <h5 className="fw-bold">
                            No Fraud Alerts
                        </h5>

                        <p className="text-muted mb-0">
                            There are currently no suspicious transactions
                            requiring administrator attention.
                        </p>

                    </div>

                ) : (

                    /* ==========================
                       Table
                    ========================== */

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Reason
                                    </th>

                                    <th>
                                        Severity
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th className="text-center">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {alertList.map((alert) => (

                                    <tr key={alert.id}>

                                        {/* ID */}

                                        <td>
                                            <span className="font-monospace fw-bold">
                                                #ALERT-{alert.id}
                                            </span>
                                        </td>


                                        {/* User */}

                                        <td>

                                            <div className="fw-semibold">
                                                {alert.username || "Unknown User"}
                                            </div>

                                        </td>


                                        {/* Amount */}

                                        <td>

                                            <span className="fw-bold">
                                                ₹
                                                {Number(
                                                    alert.amount || 0
                                                ).toLocaleString("en-IN")}
                                            </span>

                                        </td>


                                        {/* Reason */}

                                        <td>

                                            <span className="text-muted">
                                                {alert.reason ||
                                                    "Suspicious activity detected"}
                                            </span>

                                        </td>


                                        {/* Severity */}

                                        <td>
                                            {getSeverityBadge(
                                                alert.severity
                                            )}
                                        </td>


                                        {/* Status */}

                                        <td>
                                            {getStatusBadge(
                                                alert.is_resolved
                                            )}
                                        </td>


                                        {/* Action */}

                                        <td className="text-center">

                                            {!alert.is_resolved ? (

                                                <button
                                                    type="button"
                                                    className="btn btn-success btn-sm fw-bold px-3"
                                                    onClick={() =>
                                                        handleResolve(
                                                            alert.id
                                                        )
                                                    }
                                                    disabled={
                                                        loadingId ===
                                                        alert.id
                                                    }
                                                >

                                                    {loadingId ===
                                                    alert.id
                                                        ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                />

                                                                Resolving...
                                                            </>
                                                        )
                                                        : (
                                                            <>
                                                                ✓ Resolve
                                                            </>
                                                        )}

                                                </button>

                                            ) : (

                                                <span className="text-muted small fw-semibold">
                                                    ✓ Completed
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default FraudAlertTable;
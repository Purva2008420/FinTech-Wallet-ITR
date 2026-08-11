import React from "react";

const AdminStats = ({ stats }) => {
    if (!stats) {
        return (
            <div className="text-center py-4">
                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="text-muted mt-2 mb-0">
                    Loading administrator statistics...
                </p>
            </div>
        );
    }

    return (
        <div className="row g-4 mb-4">

            {/* Total Users */}
            <div className="col-md-6 col-lg-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start">

                            <div>
                                <p className="text-muted small fw-semibold mb-2">
                                    TOTAL USERS
                                </p>

                                <h2 className="fw-bold mb-1">
                                    {stats.total_users ?? 0}
                                </h2>

                                <span className="text-muted small">
                                    Registered accounts
                                </span>
                            </div>

                            <div
                                className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            >
                                <span className="fs-4">
                                    👥
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


            {/* Total Wallets */}
            <div className="col-md-6 col-lg-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start">

                            <div>
                                <p className="text-muted small fw-semibold mb-2">
                                    TOTAL WALLETS
                                </p>

                                <h2 className="fw-bold mb-1">
                                    {stats.total_wallets ?? 0}
                                </h2>

                                <span className="text-muted small">
                                    Digital wallets
                                </span>
                            </div>

                            <div
                                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            >
                                <span className="fs-4">
                                    👛
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


            {/* Transactions */}
            <div className="col-md-6 col-lg-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start">

                            <div>
                                <p className="text-muted small fw-semibold mb-2">
                                    TRANSACTIONS
                                </p>

                                <h2 className="fw-bold mb-1">
                                    {stats.total_transactions ?? 0}
                                </h2>

                                <span className="text-muted small">
                                    Total financial activity
                                </span>
                            </div>

                            <div
                                className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            >
                                <span className="fs-4">
                                    💳
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


            {/* Fraud Alerts */}
            <div className="col-md-6 col-lg-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start">

                            <div>
                                <p className="text-muted small fw-semibold mb-2">
                                    FRAUD ALERTS
                                </p>

                                <h2 className="fw-bold mb-1">
                                    {stats.total_fraud_alerts ?? 0}
                                </h2>

                                <span className="text-muted small">
                                    Security alerts detected
                                </span>
                            </div>

                            <div
                                className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            >
                                <span className="fs-4">
                                    🚨
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


            {/* Total Balance */}
            <div className="col-md-6">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                        borderRadius: "16px",
                        background:
                            "linear-gradient(135deg, #0d6efd, #274c9b)"
                    }}
                >
                    <div className="card-body p-4 text-white">

                        <p className="small fw-semibold mb-2 text-white-50">
                            TOTAL WALLET BALANCE
                        </p>

                        <h2 className="fw-bold mb-1">
                            ₹
                            {Number(
                                stats.total_balance ?? 0
                            ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </h2>

                        <span className="small text-white-50">
                            Combined balance across all wallets
                        </span>

                    </div>
                </div>
            </div>


            {/* Pending Fraud */}
            <div className="col-md-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <p className="text-muted small fw-semibold mb-2">
                            PENDING ALERTS
                        </p>

                        <h3 className="fw-bold text-warning mb-1">
                            {stats.pending_alerts ?? 0}
                        </h3>

                        <span className="text-muted small">
                            Require administrator review
                        </span>

                    </div>
                </div>
            </div>


            {/* Resolved Fraud */}
            <div className="col-md-3">
                <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "16px" }}
                >
                    <div className="card-body p-4">

                        <p className="text-muted small fw-semibold mb-2">
                            RESOLVED ALERTS
                        </p>

                        <h3 className="fw-bold text-success mb-1">
                            {stats.resolved_alerts ?? 0}
                        </h3>

                        <span className="text-muted small">
                            Security alerts resolved
                        </span>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminStats;
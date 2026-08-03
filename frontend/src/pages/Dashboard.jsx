import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ balance: "0.00", transactionsCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch wallet balance data
                const walletRes = await api.get("wallet/");
                // Fetch user transaction history list
                const txRes = await api.get("transactions/");

                setStats({
                    balance: walletRes.data.balance,
                    transactionsCount: txRes.data.count || txRes.data.results?.length || txRes.data.length || 0
                });
            } catch (err) {
                console.error("Error fetching metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container py-2">
                <div className="mb-4">
                    <h2 className="fw-bold text-dark">Welcome back, {user?.username}!</h2>
                    <p className="text-muted">Here is your live full-stack system analytics summary control desk.</p>
                </div>

                {loading ? (
                    <div className="text-center p-5"><h5>Compiling Account Summary Matrix...</h5></div>
                ) : (
                    <div className="row g-4 mb-4">
                        {/* Card 1: Balance display */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 bg-white p-3" style={{ borderRadius: "12px" }}>
                                <span className="text-muted small fw-semibold text-uppercase">Wallet Balance</span>
                                <h2 className="fw-bold text-primary my-2">I{stats.balance}</h2>
                                <Link to="/wallet" className="small text-decoration-none fw-bold">Manage Funds →</Link>
                            </div>
                        </div>

                        {/* Card 2: Total transactions ledger counter */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 bg-white p-3" style={{ borderRadius: "12px" }}>
                                <span className="text-muted small fw-semibold text-uppercase">Transactions</span>
                                <h2 className="fw-bold text-dark my-2">{stats.transactionsCount}</h2>
                                <span className="small text-muted">Active audit trail cards</span>
                            </div>
                        </div>

                        {/* Card 3: Account status condition badge */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 bg-white p-3" style={{ borderRadius: "12px" }}>
                                <span className="text-muted small fw-semibold text-uppercase">Account Status</span>
                                <h2 className="fw-bold text-success my-2">Active</h2>
                                <span className="small text-success fw-semibold">✓ Verified Profile Node</span>
                            </div>
                        </div>

                        {/* Card 4: Automated risk defense shield engine state */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 bg-white p-3" style={{ borderRadius: "12px" }}>
                                <span className="text-muted small fw-semibold text-uppercase">Fraud Shield</span>
                                <h2 className="fw-bold text-info my-2">Online</h2>
                                <span className="small text-muted">Rule scanner active</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Operations quick navigation routes deck panel */}
                <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "16px", backgroundColor: "#f8f9fa" }}>
                    <h5 className="fw-bold mb-3 text-dark">Quick Operations</h5>
                    <div className="d-flex gap-3 flex-wrap">
                        <Link to="/wallet" className="btn btn-primary px-4 py-2 fw-bold">👛 Load Money</Link>
                        <button className="btn btn-outline-secondary px-4 py-2 fw-bold" disabled>💸 Transfer Money (Day 16)</button>
                        <button className="btn btn-outline-secondary px-4 py-2 fw-bold" disabled>📜 Statement Logs (Day 17)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchWalletDetails = async () => {
        try {
            const res = await api.get("wallet/");
            setWallet(res.data);
        } catch (err) {
            setError("Failed to sync your secure wallet data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError("Please enter a valid amount greater than zero.");
            return;
        }

        try {
            const res = await api.post("wallet/add-money/", { amount: depositAmount });
            setMessage(res.data.message);
            setAmount("");

            // Update balance automatically via state transformation mapping
            setWallet(prevWallet => ({
                ...prevWallet,
                balance: res.data.new_balance
            }));
        } catch (err) {
            setError(err.response?.data?.error || "Transaction failed. Try again.");
        }
    };

    useEffect(() => {
        fetchWalletDetails();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) return (
        <div>
            <Navbar />
            <div className="container py-5"><h5>Syncing Secure Financial Matrix Columns...</h5></div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="container py-5">
                <h2 className="fw-bold mb-4 text-dark">Wallet Dashboard</h2>

                {error && <div className="alert alert-danger p-2 text-center small mb-3">{error}</div>}
                {message && <div className="alert alert-success p-2 text-center small mb-3 fw-semibold">✓ {message}</div>}

                <div className="row g-4">
                    {/* Blue Gradient Digital Debit Card Container */}
                    <div className="col-md-6">
                        <div className="card text-white p-4 shadow-lg border-0 h-100"
                             style={{ borderRadius: "20px", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="fw-bold m-0 tracking-wide">DIGITAL ACCOUNT CARD</h5>
                                <span className="fs-3">🌐</span>
                            </div>
                            <p className="mb-1 text-white-50 small" style={{ letterSpacing: "1px" }}>Wallet Number</p>
                            <h4 className="mb-4 fw-bold tracking-widest text-monospace" style={{ letterSpacing: "2px" }}>
                                {wallet?.wallet_number?.match(/.{1,4}/g)?.join(" ") || "0000 0000 0000 0000"}
                            </h4>
                            <div className="d-flex justify-content-between align-items-end mt-auto">
                                <div>
                                    <p className="mb-0 small text-white-50">Current Liquid Balance</p>
                                    <h2 className="fw-bold mb-0">₹ {wallet?.balance}</h2>
                                </div>
                                <div>
                                    <small className="text-white-50 d-block small mb-1">Created</small>
                                    <span className="badge bg-success p-2">{formatDate(wallet?.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Add Money Simulation Component Box */}
                    <div className="col-md-6">
                        <div className="card p-4 shadow border-0 h-100" style={{ borderRadius: "16px" }}>
                            <h4 className="fw-bold text-primary mb-3">Load Funds Simulation</h4>
                            <p className="text-muted small mb-4">Simulate loading credit assets into your digital wallet database rows instantly.</p>

                            <form onSubmit={handleAddMoney}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Amount (INR)</label>
                                    <div className="input-group">
                                        <span className="input-group-text fw-bold">₹</span>
                                        <input type="number" className="form-control form-control-lg" required value={amount}
                                               onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" min="1" step="0.01" />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-2 shadow-sm mt-3">
                                    Add Money
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;




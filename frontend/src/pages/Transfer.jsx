import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { transferMoney, getWallet } from "../api/walletApi";
import api from "../api/axios";

const Transfer = () => {
    const [receiverUsername, setReceiverUsername] = useState("");
    const [amount, setAmount] = useState("");
    const [currentBalance, setCurrentBalance] = useState("0.00");
    const [recentTransfers, setRecentTransfers] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Step 4 Balance Sync Hook
    const fetchBalanceAndLogs = async () => {
        try {
            const walletRes = await getWallet();
            setCurrentBalance(walletRes.data.balance);

            // Step 8 Ledger Hook: Fetch recent peer transfers
            const txRes = await api.get("transactions/?type=transfer");
            // Pull array if nested inside paginated results, otherwise raw array
            const logs = txRes.data.results || txRes.data;
            setRecentTransfers(Array.isArray(logs) ? logs.slice(0, 5) : []);
        } catch (err) {
            console.error("Failed to sync account logs.", err);
        }
    };

    useEffect(() => {
        fetchBalanceAndLogs();
    }, []);

    // Steps 2, 5, 6, 7: Transaction Form Processing Handler
    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const transferAmount = parseFloat(amount);

        // Step 6 Client-Side Security Validations
        if (!receiverUsername.trim()) {
            setError("Recipient username cannot be empty.");
            return;
        }
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError("Transfer amount must be greater than zero.");
            return;
        }
        if (transferAmount > parseFloat(currentBalance)) {
            setError("Insufficient wallet balance.");
            return;
        }

        // Step 7 Browser Confirmation Guard Alert Dialog
        const confirmClearance = window.confirm(
            `Are you sure you want to securely transfer ₹${transferAmount} to "${receiverUsername}"?`
        );
        if (!confirmClearance) return;

        setLoading(true);
        try {
            // Step 2 & 3: Trigger active api utility module call
            const res = await transferMoney({
                receiver_username: receiverUsername,
                amount: transferAmount
            });

            const transactionStatus = res.data.status;

if (transactionStatus === "SUCCESS") {
    setMessage("🟢 SUCCESS: " + res.data.message);
} else if (transactionStatus === "PENDING") {
    setMessage("🟡 PENDING: " + res.data.message);
} else if (transactionStatus === "FAILED") {
    setMessage("🔴 FAILED: " + res.data.message);
} else {
    setMessage(res.data.message || "Transaction completed.");
}

setReceiverUsername("");
setAmount("");

// Refresh balance and transaction history
await fetchBalanceAndLogs();
        } catch (err) {
            // Step 5 error alert formatting strings mapping
            setError(err.response?.data?.error || "Transaction declined. Check receiver profile status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container py-4">
                <div className="row g-4">
                    {/* Step 1 Form Column Side */}
                    <div className="col-lg-6">
                        <div className="card p-4 shadow-sm border-0 h-100" style={{ borderRadius: "16px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="fw-bold text-primary m-0">Transfer Money</h3>
                                <span className="badge bg-light text-dark border fw-bold px-3 py-2">
                                    Avail: ₹{currentBalance}
                                </span>
                            </div>
                            <p className="text-muted small mb-4">Send financial assets immediately by inputting an active destination network profile name.</p>

                            {error && <div className="alert alert-danger p-2 text-center small mb-3">{error}</div>}
                            {message && <div className="alert alert-success p-2 text-center small mb-3 fw-semibold">✓ {message}</div>}

                            <form onSubmit={handleTransferSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Receiver Username</label>
                                    <input type="text" className="form-control" required value={receiverUsername}
                                           onChange={(e) => setReceiverUsername(e.target.value)} placeholder="e.g. rahul" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold">Amount (INR)</label>
                                    <div className="input-group">
                                        <span className="input-group-text fw-bold">₹</span>
                                        <input type="number" className="form-control" required value={amount}
                                               onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 1000" />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-2 shadow-sm" disabled={loading}>
                                    {loading ? "Authorizing Escrow Ledger..." : "Transfer"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Step 8 Recent Activity Ledger Table Column Side */}
                    <div className="col-lg-6">
                        <div className="card p-4 shadow-sm border-0 h-100" style={{ borderRadius: "16px" }}>
                            <h4 className="fw-bold text-dark mb-3">Recent Transfers</h4>
                            <p className="text-muted small mb-4">Your latest peer-to-peer transactional events summary.</p>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 small">
                                    <thead className="table-light text-muted uppercase font-monospace">
                                        <tr>
                                            <th>Receiver</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransfers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted p-4">No recent peer transfers found.</td>
                                            </tr>
                                        ) : (
                                            recentTransfers.map((tx) => (
                                                <tr key={tx.id}>
                                                    <td className="fw-bold text-dark">{tx.receiver || "System"}</td>
                                                    <td className="fw-semibold text-danger">₹{tx.amount}</td>
                                                    <td>
                                                        <span className={`badge px-2 py-1 ${tx.status === "SUCCESS" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transfer;

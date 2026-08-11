import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/transfer.css";

const Transfer = () => {
    const [wallet, setWallet] = useState(null);

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);
    const [transferLoading, setTransferLoading] = useState(false);

    // ============================
    // Fetch Wallet
    // ============================

    const fetchWallet = async () => {
        try {
            const res = await api.get("wallet/");
            setWallet(res.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load wallet balance.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    // ============================
    // Transfer Money
    // ============================

    const handleTransferSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const transferAmount = parseFloat(amount);
        const currentBalance = parseFloat(wallet?.balance || 0);

        // ----------------------------
        // Validate recipient
        // ----------------------------

        if (!recipient.trim()) {
            setError("Please enter the recipient username.");
            return;
        }

        // ----------------------------
        // Validate amount
        // ----------------------------

        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError("Please enter a valid amount greater than zero.");
            return;
        }

        // ----------------------------
        // Check balance
        // ----------------------------

        if (transferAmount > currentBalance) {
            setError(
                `Insufficient wallet balance. Available balance: ₹${currentBalance.toFixed(
                    2
                )}`
            );
            return;
        }

        // ----------------------------
        // Prevent self transfer
        // ----------------------------

        const confirmTransfer = window.confirm(
            `Are you sure you want to transfer ₹${transferAmount.toFixed(
                2
            )} to ${recipient.trim()}?`
        );

        if (!confirmTransfer) {
            return;
        }

        try {
            setTransferLoading(true);

            const res = await api.post("wallet/transfer/", {
                receiver_username: recipient.trim(),
                amount: transferAmount,
                description: description.trim(),
            });

            setMessage(
                res.data.message || "Transfer completed successfully."
            );

            // Clear form
            setRecipient("");
            setAmount("");
            setDescription("");

            // Update wallet balance
            if (res.data.balance !== undefined) {
                setWallet((prevWallet) => ({
                    ...prevWallet,
                    balance: res.data.balance,
                }));
            } else {
                await fetchWallet();
            }
        } catch (err) {
            console.error("Transfer error:", err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Transfer failed. Please try again."
            );
        } finally {
            setTransferLoading(false);
        }
    };

    // ============================
    // Loading
    // ============================

    if (loading) {
        return (
            <div>
                <Navbar />

                <div className="container py-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <h5 className="mt-3">
                        Loading secure transfer system...
                    </h5>

                </div>
            </div>
        );
    }

    return (
        <div>

            <Navbar />

            <div className="container py-4 mb-5">

                {/* ============================
                    Page Header
                ============================ */}

                <div className="mb-4">

                    <h2 className="fw-bold">
                        💸 Transfer Money
                    </h2>

                    <p className="text-muted mb-0">
                        Send money securely to another FinTech Wallet user.
                    </p>

                </div>


                {/* ============================
                    Messages
                ============================ */}

                {error && (
                    <div className="alert alert-danger shadow-sm">
                        ⚠️ {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success shadow-sm fw-semibold">
                        ✓ {message}
                    </div>
                )}


                <div className="row g-4">

                    {/* ============================
                        Transfer Form
                    ============================ */}

                    <div className="col-lg-8">

                        <div className="card shadow-sm border-0 transfer-card">

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div>
                                        <h4 className="fw-bold mb-1">
                                            Send Money
                                        </h4>

                                        <p className="text-muted small mb-0">
                                            Enter the recipient and transfer details.
                                        </p>
                                    </div>

                                    <span className="transfer-icon">
                                        💸
                                    </span>

                                </div>


                                <form onSubmit={handleTransferSubmit}>

                                    {/* Recipient */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Recipient Username
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Enter recipient username"
                                            value={recipient}
                                            onChange={(e) =>
                                                setRecipient(e.target.value)
                                            }
                                            required
                                        />

                                        <small className="text-muted">
                                            Enter the username of another registered user.
                                        </small>

                                    </div>


                                    {/* Amount */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Transfer Amount
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text fw-bold">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="0.00"
                                                min="1"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) =>
                                                    setAmount(e.target.value)
                                                }
                                                required
                                            />

                                        </div>

                                        <small className="text-muted">
                                            Available balance: ₹
                                            {Number(
                                                wallet?.balance || 0
                                            ).toFixed(2)}
                                        </small>

                                    </div>


                                    {/* Description */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Description
                                            <span className="text-muted fw-normal">
                                                {" "}
                                                (Optional)
                                            </span>
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="e.g. College fees, shopping, friend payment..."
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        />

                                    </div>


                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 fw-bold"
                                        disabled={transferLoading}
                                    >

                                        {transferLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />

                                                Processing Transfer...
                                            </>
                                        ) : (
                                            <>
                                                💸 Transfer Money
                                            </>
                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>


                    {/* ============================
                        Balance / Security Panel
                    ============================ */}

                    <div className="col-lg-4">

                        {/* Balance */}

                        <div className="card border-0 shadow-sm mb-4 balance-card">

                            <div className="card-body p-4">

                                <span className="small text-white-50">
                                    AVAILABLE BALANCE
                                </span>

                                <h1 className="fw-bold text-white mt-2">
                                    ₹
                                    {Number(
                                        wallet?.balance || 0
                                    ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                    })}
                                </h1>

                                <p className="text-white-50 mb-0">
                                    Current wallet balance
                                </p>

                            </div>

                        </div>


                        {/* Security */}

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3">
                                    🛡️ Secure Transfer
                                </h5>

                                <div className="security-item">
                                    <span>🔐</span>
                                    <div>
                                        <strong>JWT Authentication</strong>
                                        <small className="text-muted d-block">
                                            Your session is protected.
                                        </small>
                                    </div>
                                </div>

                                <hr />

                                <div className="security-item">
                                    <span>🛡️</span>
                                    <div>
                                        <strong>Fraud Monitoring</strong>
                                        <small className="text-muted d-block">
                                            Transactions are monitored.
                                        </small>
                                    </div>
                                </div>

                                <hr />

                                <div className="security-item">
                                    <span>✓</span>
                                    <div>
                                        <strong>Balance Validation</strong>
                                        <small className="text-muted d-block">
                                            Insufficient transfers are blocked.
                                        </small>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ============================
                    Bottom Navigation
                ============================ */}

                <div className="row g-3 mt-4">

                    <div className="col-md-4">

                        <Link
                            to="/wallet"
                            className="text-decoration-none"
                        >

                            <div className="card border-0 shadow-sm p-3 text-center">

                                <h3>👛</h3>

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
                            to="/transactions"
                            className="text-decoration-none"
                        >

                            <div className="card border-0 shadow-sm p-3 text-center">

                                <h3>📜</h3>

                                <h6 className="fw-bold text-dark">
                                    Transactions
                                </h6>

                                <small className="text-muted">
                                    View transaction history
                                </small>

                            </div>

                        </Link>

                    </div>


                    <div className="col-md-4">

                        <Link
                            to="/profile"
                            className="text-decoration-none"
                        >

                            <div className="card border-0 shadow-sm p-3 text-center">

                                <h3>👤</h3>

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

export default Transfer;

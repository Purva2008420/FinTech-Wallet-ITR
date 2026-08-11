import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/wallet.css";

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

   const [loading, setLoading] = useState(true);
const [depositLoading, setDepositLoading] = useState(false);
const [withdrawLoading, setWithdrawLoading] = useState(false);

// Recent wallet activity
const [showActivity, setShowActivity] = useState(false);
const successfulTransactions = transactions.filter(
    (tx) => tx.status === "SUCCESS"
);

const totalDeposited = successfulTransactions
    .filter((tx) => tx.transaction_type === "DEPOSIT")
    .reduce(
        (total, tx) => total + Number(tx.amount || 0),
        0
    );

const totalWithdrawn = successfulTransactions
    .filter((tx) => tx.transaction_type === "WITHDRAW")
    .reduce(
        (total, tx) => total + Number(tx.amount || 0),
        0
    );

const totalTransfers = successfulTransactions
    .filter((tx) => tx.transaction_type === "TRANSFER")
    .reduce(
        (total, tx) => total + Number(tx.amount || 0),
        0
    );

const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    // ============================
    // Fetch Wallet Details
    // ============================

    const fetchWalletDetails = async () => {
    try {
        setLoading(true);
        setError("");

        const [walletRes, transactionRes] = await Promise.all([
            api.get("wallet/"),
            api.get("transactions/")
        ]);

        setWallet(walletRes.data);

        const logs =
            transactionRes.data.results ||
            transactionRes.data;

        setTransactions(
            Array.isArray(logs) ? logs : []
        );

    } catch (err) {
        console.error("Wallet error:", err);

        setError(
            err.response?.data?.error ||
            "Failed to sync your secure wallet data."
        );
    } finally {
        setLoading(false);
    }
};

    // ============================
    // Add Money
    // ============================

    const handleAddMoney = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const depositAmount = parseFloat(amount);

        if (
            isNaN(depositAmount) ||
            depositAmount <= 0
        ) {
            setError(
                "Please enter a valid amount greater than zero."
            );
            return;
        }

        setDepositLoading(true);

        try {
            const res = await api.post(
                "wallet/add-money/",
                {
                    amount: depositAmount,
                }
            );

            setMessage(
                res.data.message ||
                "Money added successfully."
            );

            setAmount("");

            // Update wallet balance
            setWallet((prevWallet) => ({
                ...prevWallet,
                balance:
                    res.data.new_balance ??
                    res.data.balance ??
                    prevWallet?.balance,
            }));

        } catch (err) {
            console.error("Deposit error:", err);

            setError(
                err.response?.data?.error ||
                "Transaction failed. Please try again."
            );
        } finally {
            setDepositLoading(false);
        }
    };

    // ============================
    // Withdraw Money
    // ============================

    const handleWithdraw = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const withdrawalValue = parseFloat(withdrawAmount);

    if (isNaN(withdrawalValue) || withdrawalValue <= 0) {
        setError(
            "Please enter a valid withdrawal amount greater than zero."
        );
        return;
    }

    const currentBalance = parseFloat(wallet?.balance || 0);

    if (withdrawalValue > currentBalance) {
        setError(
            `Insufficient wallet balance. Your available balance is ₹${currentBalance.toFixed(2)}.`
        );
        return;
    }

    const confirmWithdrawal = window.confirm(
        `Are you sure you want to withdraw ₹${withdrawalValue.toFixed(2)}?`
    );

    if (!confirmWithdrawal) {
        return;
    }

    setWithdrawLoading(true);

    try {
        const res = await api.post(
            "wallet/withdraw/",
            {
                amount: withdrawalValue,
            }
        );

        setMessage(
            res.data.message ||
            "Withdrawal successful."
        );

        setWithdrawAmount("");

        setWallet((prevWallet) => ({
            ...prevWallet,
            balance:
                res.data.balance ??
                res.data.new_balance ??
                prevWallet?.balance,
        }));

    } catch (err) {
        console.error("Withdrawal error:", err);

        setError(
            err.response?.data?.error ||
            "Withdrawal failed. Please try again."
        );
    } finally {
        setWithdrawLoading(false);
    }
};

    // ============================
    // Format Date
    // ============================

    const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }

        const date = new Date(dateString);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ============================
    // Format Wallet Number
    // ============================

    const formatWalletNumber = (walletNumber) => {
        if (!walletNumber) {
            return "0000 0000 0000 0000";
        }

        return walletNumber
            .toString()
            .replace(/\s/g, "")
            .match(/.{1,4}/g)
            ?.join(" ");
    };

    // ============================
    // Load Wallet
    // ============================
const getTransactionType = (type) => {
    switch (type) {
        case "DEPOSIT":
            return {
                label: "Deposit",
                icon: "⬇️",
                className: "wallet-activity-deposit",
            };

        case "WITHDRAW":
            return {
                label: "Withdrawal",
                icon: "⬆️",
                className: "wallet-activity-withdraw",
            };

        case "TRANSFER":
            return {
                label: "Transfer",
                icon: "🔄",
                className: "wallet-activity-transfer",
            };

        default:
            return {
                label: type || "Transaction",
                icon: "💳",
                className: "wallet-activity-default",
            };
    }
};


const getStatusBadge = (status) => {
    switch (status) {
        case "SUCCESS":
            return (
                <span className="badge bg-success">
                    ✓ Success
                </span>
            );

        case "PENDING":
            return (
                <span className="badge bg-warning text-dark">
                    🟡 Pending
                </span>
            );

        case "FAILED":
            return (
                <span className="badge bg-danger">
                    ✕ Failed
                </span>
            );

        default:
            return (
                <span className="badge bg-secondary">
                    {status || "Unknown"}
                </span>
            );
    }
};
    useEffect(() => {
        fetchWalletDetails();
    }, []);

    // ============================
    // Loading Screen
    // ============================

    if (loading) {
        return (
            <div>
                <Navbar />

                <div className="container py-5">

                    <div className="wallet-loading-card text-center">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <h5 className="mt-3 fw-bold">
                            Loading Your Wallet
                        </h5>

                        <p className="text-muted mb-0">
                            Syncing your secure financial data...
                        </p>

                    </div>

                </div>
            </div>
        );
    }

    // ============================
    // Main UI
    // ============================

    return (
        <div>

            <Navbar />

            <div className="container py-4 mb-5">

                {/* ============================
                    Page Header
                ============================ */}

                <div className="wallet-page-header mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            Wallet
                        </h2>

                        <p className="text-muted mb-0">
                            Manage your digital wallet and funds securely.
                        </p>
                    </div>

                    <div className="wallet-security-badge">
                        🛡️ Secure Wallet
                    </div>

                </div>


                {/* ============================
                    Messages
                ============================ */}

                {error && (
                    <div
                        className="alert alert-danger shadow-sm border-0"
                        role="alert"
                    >
                        <strong>⚠️ Error:</strong>{" "}
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        className="alert alert-success shadow-sm border-0"
                        role="alert"
                    >
                        <strong>✓ Success:</strong>{" "}
                        {message}
                    </div>
                )}


                {/* ============================
                    Wallet Card + Balance
                ============================ */}

                <div className="row g-4 mb-4">

                    {/* Digital Wallet Card */}

                    <div className="col-lg-7">

                        <div className="digital-wallet-card">

                            <div className="wallet-card-top">

                                <div>
                                    <span className="wallet-card-label">
                                        DIGITAL WALLET
                                    </span>

                                    <h5 className="fw-bold mb-0">
                                        FinTech Vault
                                    </h5>
                                </div>

                                <div className="wallet-chip">
                                    💳
                                </div>

                            </div>


                            <div className="wallet-card-middle">

                                <span>
                                    Wallet Number
                                </span>

                                <h4 className="wallet-number">
                                    {formatWalletNumber(
                                        wallet?.wallet_number
                                    )}
                                </h4>

                            </div>


                            <div className="wallet-card-bottom">

                                <div>

                                    <small>
                                        AVAILABLE BALANCE
                                    </small>

                                    <h2>
                                        ₹{" "}
                                        {Number(
                                            wallet?.balance || 0
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </h2>

                                </div>

                                <div className="text-end">

                                    <small>
                                        WALLET CREATED
                                    </small>

                                    <p className="mb-0 fw-semibold">
                                        {formatDate(
                                            wallet?.created_at
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Wallet Information */}

                    <div className="col-lg-5">

                        <div className="card wallet-info-card border-0 shadow-sm h-100">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Wallet Overview
                                </h5>


                                <div className="wallet-info-row">

                                    <div>
                                        <span className="wallet-info-icon">
                                            💰
                                        </span>

                                        <span>
                                            Current Balance
                                        </span>
                                    </div>

                                    <strong>
                                        ₹
                                        {Number(
                                            wallet?.balance || 0
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                            }
                                        )}
                                    </strong>

                                </div>


                                <div className="wallet-info-row">

                                    <div>
                                        <span className="wallet-info-icon">
                                            🔐
                                        </span>

                                        <span>
                                            Wallet Status
                                        </span>
                                    </div>

                                    <span className="badge bg-success">
                                        Active
                                    </span>

                                </div>


                                <div className="wallet-info-row">

                                    <div>
                                        <span className="wallet-info-icon">
                                            🛡️
                                        </span>

                                        <span>
                                            Security
                                        </span>
                                    </div>

                                    <span className="text-success fw-semibold">
                                        Protected
                                    </span>

                                </div>


                                <div className="wallet-info-row border-0">

                                    <div>
                                        <span className="wallet-info-icon">
                                            📅
                                        </span>

                                        <span>
                                            Created
                                        </span>
                                    </div>

                                    <span className="text-muted">
                                        {formatDate(
                                            wallet?.created_at
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                {/* ============================
    Financial Summary
============================ */}

<div className="mb-4">

    <div className="mb-3">
        <h5 className="fw-bold mb-1">
            Financial Summary
        </h5>

        <p className="text-muted small mb-0">
            A quick overview of your wallet activity.
        </p>
    </div>

    <div className="row g-3">

        {/* Current Balance */}

        <div className="col-md-3">

            <div className="wallet-summary-card balance-summary">

                <div className="wallet-summary-icon">
                    💰
                </div>

                <div>
                    <span>
                        Current Balance
                    </span>

                    <h4>
                        ₹{formatCurrency(wallet?.balance)}
                    </h4>
                </div>

            </div>

        </div>


        {/* Deposited */}

        <div className="col-md-3">

            <div className="wallet-summary-card deposit-summary">

                <div className="wallet-summary-icon">
                    ⬇️
                </div>

                <div>
                    <span>
                        Total Deposited
                    </span>

                    <h4>
                        ₹{formatCurrency(totalDeposited)}
                    </h4>
                </div>

            </div>

        </div>


        {/* Withdrawn */}

        <div className="col-md-3">

            <div className="wallet-summary-card withdraw-summary">

                <div className="wallet-summary-icon">
                    ⬆️
                </div>

                <div>
                    <span>
                        Total Withdrawn
                    </span>

                    <h4>
                        ₹{formatCurrency(totalWithdrawn)}
                    </h4>
                </div>

            </div>

        </div>


        {/* Transfers */}

        <div className="col-md-3">

            <div className="wallet-summary-card transfer-summary">

                <div className="wallet-summary-icon">
                    🔄
                </div>

                <div>
                    <span>
                        Total Transfers
                    </span>

                    <h4>
                        ₹{formatCurrency(totalTransfers)}
                    </h4>
                </div>

            </div>

        </div>

    </div>

</div>

               {/* ============================
    Financial Operations
============================ */}

<div className="row g-4">

    {/* ============================
        Add Money
    ============================ */}

    <div className="col-lg-6">

        <div className="card wallet-operation-card border-0 shadow-sm">

            <div className="card-body p-4">

                <div className="operation-icon deposit-icon">
                    +
                </div>

                <h4 className="fw-bold mt-3 mb-2">
                    Add Money
                </h4>

                <p className="text-muted small mb-4">
                    Add funds to your digital wallet.
                    The balance will be updated instantly.
                </p>

                <form onSubmit={handleAddMoney}>

                    <label className="form-label fw-semibold">
                        Amount
                    </label>

                    <div className="input-group input-group-lg mb-3">

                        <span className="input-group-text fw-bold">
                            ₹
                        </span>

                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="Enter amount"
                            min="1"
                            step="0.01"
                            required
                            disabled={depositLoading}
                        />

                    </div>

                    {/* Quick Amounts */}

                    <div className="d-flex gap-2 flex-wrap mb-4">

                        {[500, 1000, 2000, 5000].map(
                            (value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() =>
                                        setAmount(
                                            value.toString()
                                        )
                                    }
                                >
                                    ₹{value}
                                </button>
                            )
                        )}

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold"
                        disabled={depositLoading}
                    >

                        {depositLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />

                                Processing...
                            </>
                        ) : (
                            <>
                                👛 Add Money
                            </>
                        )}

                    </button>

                </form>

            </div>

        </div>

    </div>


    {/* ============================
        Withdraw Money
    ============================ */}

    <div className="col-lg-6">

        <div className="card wallet-operation-card border-0 shadow-sm">

            <div className="card-body p-4">

                <div className="operation-icon withdraw-icon">
                    −
                </div>

                <h4 className="fw-bold mt-3 mb-2">
                    Withdraw Money
                </h4>

                <p className="text-muted small mb-4">
                    Withdraw funds from your wallet.
                    Your available balance is checked automatically.
                </p>

                <form onSubmit={handleWithdraw}>

                    <label className="form-label fw-semibold">
                        Withdrawal Amount
                    </label>

                    <div className="input-group input-group-lg mb-3">

                        <span className="input-group-text fw-bold">
                            ₹
                        </span>

                        <input
                            type="number"
                            className="form-control"
                            value={withdrawAmount}
                            onChange={(e) =>
                                setWithdrawAmount(
                                    e.target.value
                                )
                            }
                            placeholder="Enter amount"
                            min="1"
                            step="0.01"
                            required
                            disabled={withdrawLoading}
                        />

                    </div>


                    {/* Available Balance */}

                    <div className="available-balance-box mb-4">

                        <span>
                            Available Balance
                        </span>

                        <strong>
                            ₹
                            {Number(
                                wallet?.balance || 0
                            ).toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}
                        </strong>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-danger btn-lg w-100 fw-bold"
                        disabled={withdrawLoading}
                    >

                        {withdrawLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />

                                Processing...
                            </>
                        ) : (
                            <>
                                💰 Withdraw Money
                            </>
                        )}

                    </button>

                </form>

            </div>

        </div>

    </div>

</div>


{/* ============================
    Recent Wallet Activity
============================ */}

<div className="wallet-activity-wrapper mt-4">

    <div className="card wallet-activity-card border-0 shadow-sm">

        {/* Clickable Header */}

        <button
            type="button"
            className="wallet-activity-toggle"
            onClick={() =>
                setShowActivity(!showActivity)
            }
        >

            <div className="d-flex align-items-center gap-3">

                <div className="wallet-activity-toggle-icon">
                    📊
                </div>

                <div className="text-start">

                    <h5 className="fw-bold mb-1">
                        Recent Wallet Activity
                    </h5>

                    <p className="text-muted small mb-0">
                        Your latest deposits, withdrawals and transfers.
                    </p>

                </div>

            </div>


            <div className="d-flex align-items-center gap-3">

                <span className="badge bg-light text-dark border px-3 py-2">
                    {transactions.length} Transactions
                </span>

                <span className="wallet-activity-arrow">
                    {showActivity ? "▲" : "▼"}
                </span>

            </div>

        </button>


        {/* Activity Content */}

        {showActivity && (

            <div className="wallet-activity-content">

                {transactions.length === 0 ? (

                    <div className="text-center py-5">

                        <div className="display-5 mb-3">
                            📭
                        </div>

                        <h6 className="fw-bold">
                            No wallet activity yet
                        </h6>

                        <p className="text-muted small mb-0">
                            Your recent transactions will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="wallet-activity-list">

                        {transactions.slice(0, 5).map((tx) => {

                            const typeInfo =
                                getTransactionType(
                                    tx.transaction_type
                                );

                            return (

                                <div
                                    key={tx.id}
                                    className="wallet-activity-item"
                                >

                                    <div
                                        className={`wallet-activity-icon ${typeInfo.className}`}
                                    >
                                        {typeInfo.icon}
                                    </div>


                                    <div className="wallet-activity-details">

                                        <div className="fw-bold">
                                            {typeInfo.label}
                                        </div>

                                        <small className="text-muted">

                                            {tx.created_at
                                                ? new Date(
                                                    tx.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )
                                                : "Date unavailable"
                                            }

                                        </small>

                                    </div>


                                    <div className="wallet-activity-amount">

                                        <strong
                                            className={
                                                tx.transaction_type ===
                                                "DEPOSIT"
                                                    ? "text-success"
                                                    : tx.transaction_type ===
                                                      "WITHDRAW"
                                                    ? "text-danger"
                                                    : "text-primary"
                                            }
                                        >

                                            {tx.transaction_type ===
                                            "DEPOSIT"
                                                ? "+"
                                                : tx.transaction_type ===
                                                  "WITHDRAW"
                                                ? "−"
                                                : ""
                                            }

                                            ₹{formatCurrency(tx.amount)}

                                        </strong>

                                        <div className="mt-1">
                                            {getStatusBadge(
                                                tx.status
                                            )}
                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        )}

    </div>

</div>


                {/* ============================
                    Security Notice
                ============================ */}

                <div className="wallet-security-card mt-4">

                    <div className="d-flex align-items-start gap-3">

                        <div className="security-icon">
                            🛡️
                        </div>

                        <div>

                            <h6 className="fw-bold mb-1">
                                Your wallet is protected
                            </h6>

                            <p className="text-muted small mb-0">
                                Transactions are authenticated using
                                secure JWT authentication and monitored
                                by the FinTech Vault fraud protection system.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Wallet;




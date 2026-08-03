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

    // Step 4 & 5: Dispatch transaction payload and execute real-time state updates
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

            // Step 5: Update balance automatically via state transformation mapping
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

    if (loading) return <div className="container py-5"><h5>Syncing Secure Financial Matrix Columns...</h5></div>;

     if (loading) return <div className="container py-5"><h5>Syncing Secure Financial Matrix Columns...</h5></div>;

    return (
        <div>
            <Navbar /> {/* <-- 1. Insert the Navbar right here at the very top! */}
            <div className="container py-5"> {/* <-- 2. The rest of your container continues here */}
                <h2 className="fw-bold mb-4 text-dark">Wallet Dashboard</h2>

                {error && <div className="alert alert-danger p-2 text-center small mb-3">{error}</div>}
                {message && <div className="alert alert-success p-2 text-center small mb-3 fw-semibold">✓ {message}</div>}

                <div className="row g-4">
                    {/* ... Your debit card and load funds layout code remains exactly inside here ... */}
                </div>
            </div>
        </div>
    );
};

export default Wallet;



import React, { useEffect, useState } from "react";
import {
    getTransactions,
    getTransactionById,
} from "../api/transactionApi";
import Navbar from "../components/Navbar";
import TransactionModal from "../components/TransactionModal";
import Pagination from "../components/Pagination";

import "../styles/transactions.css";

const Transactions = () => {

    // ==========================
    // State Variables
    // ==========================

    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ==========================
    // Load Transactions
    // ==========================

    const loadTransactions = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            const data = await getTransactions(
                page,
                typeFilter,
                statusFilter
            );

            if (data?.results) {

                setTransactions(data.results);

                setCurrentPage(page);

                setTotalPages(
                    Math.max(
                        1,
                        Math.ceil((data.count || 0) / 10)
                    )
                );

            } else if (Array.isArray(data)) {

                setTransactions(data);

                setCurrentPage(page);
                setTotalPages(1);

            } else {

                setTransactions([]);

                setCurrentPage(page);
                setTotalPages(1);

            }

        } catch (err) {

            console.error(
                "Transaction loading error:",
                err
            );

            setError("Unable to load transactions.");

            setTransactions([]);

        } finally {

            setLoading(false);

        }

    };

    // ==========================
    // Initial Load
    // ==========================

    useEffect(() => {

        loadTransactions(1);

    }, []);

    // ==========================
    // Reload When API Filters Change
    // ==========================

    useEffect(() => {

        setCurrentPage(1);

        loadTransactions(1);

    }, [typeFilter, statusFilter]);

    // ==========================
    // Search + Date Filtering
    // ==========================

    useEffect(() => {

        const keyword = searchTerm
            .trim()
            .toLowerCase();

        const filtered = transactions.filter((tx) => {

            // --------------------------
            // Search
            // --------------------------

            const matchesSearch =
                !keyword ||
                tx.description
                    ?.toLowerCase()
                    .includes(keyword) ||
                tx.sender
                    ?.toLowerCase()
                    .includes(keyword) ||
                tx.receiver
                    ?.toLowerCase()
                    .includes(keyword) ||
                tx.transaction_type
                    ?.toLowerCase()
                    .includes(keyword);

            // --------------------------
            // Transaction Date
            // --------------------------

            const transactionDate = tx.created_at
                ? new Date(tx.created_at)
                : null;

            const fromDate = dateFrom
                ? new Date(`${dateFrom}T00:00:00`)
                : null;

            const toDate = dateTo
                ? new Date(`${dateTo}T23:59:59`)
                : null;

            const matchesFromDate =
                !fromDate ||
                (
                    transactionDate &&
                    transactionDate >= fromDate
                );

            const matchesToDate =
                !toDate ||
                (
                    transactionDate &&
                    transactionDate <= toDate
                );

            return (
                matchesSearch &&
                matchesFromDate &&
                matchesToDate
            );

        });

        setFilteredTransactions(filtered);

    }, [
        searchTerm,
        dateFrom,
        dateTo,
        transactions
    ]);

    // ==========================
    // View Transaction Details
    // ==========================

    const viewTransaction = async (id) => {

        try {

            const data = await getTransactionById(id);

            setSelectedTransaction(data);
            setShowModal(true);

        } catch (err) {

            console.error(
                "Transaction details error:",
                err
            );

            alert(
                "Unable to fetch transaction details."
            );

        }

    };

    // ==========================
    // Export Transactions to CSV
    // ==========================

    const exportToCSV = () => {

        if (filteredTransactions.length === 0) {

            alert(
                "No transactions available to export."
            );

            return;

        }

        const headers = [
            "Date",
            "Transaction Type",
            "Amount",
            "Status",
            "Description",
            "Sender",
            "Receiver",
        ];

        const rows = filteredTransactions.map((tx) => [

            tx.created_at
                ? new Date(tx.created_at).toLocaleString(
                    "en-IN"
                )
                : "",

            tx.transaction_type || "",

            tx.amount || "",

            tx.status || "",

            tx.description || "",

            tx.sender || "",

            tx.receiver || "",

        ]);

        const totalTransactions =
            filteredTransactions.length;

        const totalAmount =
            filteredTransactions.reduce(
                (total, tx) =>
                    total + Number(tx.amount || 0),
                0
            );

        const successfulTransactions =
            filteredTransactions.filter(
                (tx) =>
                    tx.status?.toUpperCase() === "SUCCESS"
            ).length;

        const failedTransactions =
            filteredTransactions.filter(
                (tx) =>
                    tx.status?.toUpperCase() === "FAILED"
            ).length;

        const summaryRows = [

            [
                "FINTECH WALLET - TRANSACTION STATEMENT"
            ],

            [],

            [
                "Total Transactions",
                totalTransactions
            ],

            [
                "Total Amount",
                totalAmount.toFixed(2)
            ],

            [
                "Successful Transactions",
                successfulTransactions
            ],

            [
                "Failed Transactions",
                failedTransactions
            ],

            [],

        ];

        const csvContent = [

            ...summaryRows,

            headers,

            ...rows,

        ]
            .map((row) =>
                row
                    .map((value) => {

                        const text = String(
                            value ?? ""
                        ).replace(
                            /"/g,
                            '""'
                        );

                        return `"${text}"`;

                    })
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "fintech_transaction_statement.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    };

    // ==========================
    // Print / PDF
    // ==========================

    const printStatement = () => {

        if (filteredTransactions.length === 0) {

            alert(
                "No transactions available to print."
            );

            return;

        }

        window.print();

    };

    // ==========================
    // Pagination
    // ==========================

    const handlePrevious = () => {

        if (currentPage > 1) {

            loadTransactions(
                currentPage - 1
            );

        }

    };

    const handleNext = () => {

        if (currentPage < totalPages) {

            loadTransactions(
                currentPage + 1
            );

        }

    };

    // ==========================
    // Transaction Summary
    // ==========================

    const totalTransactions =
        filteredTransactions.length;

    const totalAmount =
        filteredTransactions.reduce(
            (total, tx) =>
                total + Number(tx.amount || 0),
            0
        );

    const successfulTransactions =
        filteredTransactions.filter(
            (tx) =>
                tx.status?.toUpperCase() === "SUCCESS"
        ).length;

    const failedTransactions =
        filteredTransactions.filter(
            (tx) =>
                tx.status?.toUpperCase() === "FAILED"
        ).length;

    // ==========================
    // Status Badge
    // ==========================

    const getStatusBadge = (status) => {

        switch (status?.toUpperCase()) {

            case "SUCCESS":

                return (
                    <span className="badge bg-success">
                        ✓ SUCCESS
                    </span>
                );

            case "FAILED":

                return (
                    <span className="badge bg-danger">
                        ✕ FAILED
                    </span>
                );

            case "PENDING":

                return (
                    <span className="badge bg-warning text-dark">
                        🟡 PENDING
                    </span>
                );

            default:

                return (
                    <span className="badge bg-secondary">
                        {status || "UNKNOWN"}
                    </span>
                );

        }

    };

    // ==========================
    // Reset Filters
    // ==========================

    const resetFilters = () => {

        setSearchTerm("");
        setTypeFilter("ALL");
        setStatusFilter("ALL");
        setDateFrom("");
        setDateTo("");
        setCurrentPage(1);

    };

    // ==========================
    // JSX
    // ==========================

    return (

        <div className="container mt-4 mb-5">

            <div className="card shadow">

                {/* ==========================
                    Header
                ========================== */}

                <div className="card-header bg-primary text-white">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                        <h3 className="mb-0">
                            📜 Transaction History
                        </h3>

                        <div>

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={exportToCSV}
                            >
                                📥 Export CSV
                            </button>

                            <button
                                type="button"
                                className="btn btn-light ms-2"
                                onClick={printStatement}
                            >
                                📄 Download PDF
                            </button>

                        </div>

                    </div>

                </div>

                <div className="card-body">

                    {/* ==========================
                        Summary Cards
                    ========================== */}

                    <div className="row mb-4">

                        <div className="col-md-3 mb-3">

                            <div className="card shadow-sm h-100 transaction-summary-card">

                                <div className="card-body">

                                    <h6 className="text-muted">
                                        Total Transactions
                                    </h6>

                                    <h3 className="mb-0">
                                        {totalTransactions}
                                    </h3>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3 mb-3">

                            <div className="card shadow-sm h-100 transaction-summary-card">

                                <div className="card-body">

                                    <h6 className="text-muted">
                                        Total Amount
                                    </h6>

                                    <h3 className="mb-0">
                                        ₹
                                        {totalAmount.toFixed(2)}
                                    </h3>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3 mb-3">

                            <div className="card shadow-sm h-100 transaction-summary-card">

                                <div className="card-body">

                                    <h6 className="text-muted">
                                        Successful
                                    </h6>

                                    <h3 className="mb-0 text-success">
                                        {successfulTransactions}
                                    </h3>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3 mb-3">

                            <div className="card shadow-sm h-100 transaction-summary-card">

                                <div className="card-body">

                                    <h6 className="text-muted">
                                        Failed
                                    </h6>

                                    <h3 className="mb-0 text-danger">
                                        {failedTransactions}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ==========================
                        Filters
                    ========================== */}

                    <div className="row mb-4">

                        {/* Search */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-semibold">
                                Search
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* Type */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-semibold">
                                Transaction Type
                            </label>

                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Types
                                </option>

                                <option value="DEPOSIT">
                                    Deposit
                                </option>

                                <option value="TRANSFER">
                                    Transfer
                                </option>

                                <option value="WITHDRAW">
                                    Withdraw
                                </option>

                            </select>

                        </div>

                        {/* Status */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-semibold">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Status
                                </option>

                                <option value="SUCCESS">
                                    SUCCESS
                                </option>

                                <option value="FAILED">
                                    FAILED
                                </option>

                                <option value="PENDING">
                                    PENDING
                                </option>

                            </select>

                        </div>

                        {/* From Date */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-semibold">
                                From Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateFrom}
                                onChange={(e) =>
                                    setDateFrom(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* To Date */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-semibold">
                                To Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateTo}
                                onChange={(e) =>
                                    setDateTo(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* Reset */}

                        <div className="col-md-4 mb-3 d-flex align-items-end">

                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={resetFilters}
                            >
                                🔄 Reset Filters
                            </button>

                        </div>

                    </div>

                    {/* ==========================
                        Loading
                    ========================== */}

                    {loading && (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            />

                            <p className="mt-3">
                                Loading Transactions...
                            </p>

                        </div>

                    )}

                    {/* ==========================
                        Error
                    ========================== */}

                    {!loading && error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}

                    {/* ==========================
                        Empty
                    ========================== */}

                    {!loading &&
                        !error &&
                        filteredTransactions.length === 0 && (

                            <div className="alert alert-info">
                                No Transactions Found
                            </div>

                        )}

                    {/* ==========================
                        Table
                    ========================== */}

                    {!loading &&
                        !error &&
                        filteredTransactions.length > 0 && (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Action</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredTransactions.map(
                                            (tx) => (

                                                <tr key={tx.id}>

                                                    <td>

                                                        {tx.created_at
                                                            ? new Date(
                                                                tx.created_at
                                                            ).toLocaleDateString(
                                                                "en-IN"
                                                            )
                                                            : "-"
                                                        }

                                                    </td>

                                                    <td>
                                                        {tx.transaction_type ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="fw-semibold">

                                                        ₹
                                                        {Number(
                                                            tx.amount || 0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </td>

                                                    <td>

                                                        {getStatusBadge(
                                                            tx.status
                                                        )}

                                                    </td>

                                                    <td>

                                                        {tx.description ||
                                                            "-"
                                                        }

                                                    </td>

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() =>
                                                                viewTransaction(
                                                                    tx.id
                                                                )
                                                            }
                                                        >
                                                            👁️ View
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    {/* ==========================
                        Pagination
                    ========================== */}

                    {!loading &&
                        !error &&
                        filteredTransactions.length > 0 &&
                        totalPages > 1 && (

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                            />

                        )}

                </div>

            </div>

            {/* ==========================
                Transaction Details Modal
            ========================== */}

            <TransactionModal
                show={showModal}
                transaction={selectedTransaction}
                onClose={() => {

                    setShowModal(false);
                    setSelectedTransaction(null);

                }}
            />

        </div>

    );

};

export default Transactions;

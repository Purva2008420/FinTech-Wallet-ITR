import React, { useEffect, useState } from "react";
import {
  getTransactions,
  getTransactionById,
} from "../api/transactionApi";

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

      // Django REST Framework Pagination
      if (data.results) {
        setTransactions(data.results);
        setFilteredTransactions(data.results);

        setCurrentPage(page);

        setTotalPages(
          Math.max(1, Math.ceil(data.count / 10))
        );
      }

      // Without Pagination
      else {
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (err) {
      console.error(err);

      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load on Page Open
  // ==========================

  useEffect(() => {
    loadTransactions();
  }, []);

  // ==========================
  // Reload when filters change
  // ==========================

  useEffect(() => {
    loadTransactions(currentPage);
  }, [typeFilter, statusFilter]);

  // ==========================
  // Search
  // ==========================

 useEffect(() => {
  const keyword = searchTerm.trim().toLowerCase();

  const filtered = transactions.filter((tx) => {

    // -------------------------
    // Search filter
    // -------------------------

    const matchesSearch =
      !keyword ||
      tx.description?.toLowerCase().includes(keyword) ||
      tx.sender?.toLowerCase().includes(keyword) ||
      tx.receiver?.toLowerCase().includes(keyword) ||
      tx.transaction_type?.toLowerCase().includes(keyword);

    // -------------------------
    // Date filter
    // -------------------------

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
      (transactionDate && transactionDate >= fromDate);

    const matchesToDate =
      !toDate ||
      (transactionDate && transactionDate <= toDate);

    return (
      matchesSearch &&
      matchesFromDate &&
      matchesToDate
    );
  });

  setFilteredTransactions(filtered);

}, [searchTerm, dateFrom, dateTo, transactions]);

  // ==========================
  // View Details
  // ==========================

  const viewTransaction = async (id) => {
    try {
      const data = await getTransactionById(id);

      setSelectedTransaction(data);

      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch transaction details.");
    }
  };
// ==========================
// Export Transactions to CSV
// ==========================

const exportToCSV = () => {
  if (filteredTransactions.length === 0) {
    alert("No transactions available to export.");
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
      ? new Date(tx.created_at).toLocaleString()
      : "",

    tx.transaction_type || "",

    tx.amount || "",

    tx.status || "",

    tx.description || "",

    tx.sender || "",

    tx.receiver || "",
  ]);

  const summaryRows = [
    ["FINTECH WALLET - TRANSACTION STATEMENT"],
    [],
    ["Total Transactions", totalTransactions],
    ["Total Amount", totalAmount.toFixed(2)],
    ["Successful Transactions", successfulTransactions],
    ["Failed Transactions", failedTransactions],
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
          const text = String(value ?? "").replace(/"/g, '""');
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

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "fintech_transaction_statement.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
// ==========================
// Print Transaction Statement
// ==========================

const printStatement = () => {
  if (filteredTransactions.length === 0) {
    alert("No transactions available to print.");
    return;
  }

  window.print();
};
  // ==========================
  // Pagination
  // ==========================

  const handlePrevious = () => {
    if (currentPage > 1) {
      loadTransactions(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      loadTransactions(currentPage + 1);
    }
  };
// ==========================
// Transaction Summary
// ==========================

const totalTransactions = filteredTransactions.length;

const totalAmount = filteredTransactions.reduce(
  (total, tx) => total + Number(tx.amount || 0),
  0
);

const successfulTransactions = filteredTransactions.filter(
  (tx) => tx.status?.toUpperCase() === "SUCCESS"
).length;

const failedTransactions = filteredTransactions.filter(
  (tx) => tx.status?.toUpperCase() === "FAILED"
).length;
  // ==========================
  // Status Badge
  // ==========================

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="badge bg-success">
            SUCCESS
          </span>
        );

      case "FAILED":
        return (
          <span className="badge bg-danger">
            FAILED
          </span>
        );

      case "PENDING":
        return (
          <span className="badge bg-warning text-dark">
            PENDING
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {status}
          </span>
        );
    }
  };

  return (
          <div className="container mt-4">

      <div className="card shadow">

       <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

  <h3 className="mb-0">
    Transaction History
  </h3>

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

        <div className="card-body">
{/* Transaction Summary */}

<div className="row mb-4">

  {/* Total Transactions */}

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


  {/* Total Amount */}

  <div className="col-md-3 mb-3">

    <div className="card shadow-sm h-100 transaction-summary-card">

      <div className="card-body">

        <h6 className="text-muted">
          Total Amount
        </h6>

        <h3 className="mb-0">
          ₹{totalAmount.toFixed(2)}
        </h3>

      </div>

    </div>

  </div>


  {/* Successful */}

  <div className="col-md-3 mb-3">

    <div className="card shadow-sm h-100 transaction-summary-card">

      <div className="card-body">

        <h6 className="text-muted">
          Successful
        </h6>

        <h3 className="mb-0">
          {successfulTransactions}
        </h3>

      </div>

    </div>

  </div>


  {/* Failed */}

  <div className="col-md-3 mb-3">

    <div className="card shadow-sm h-100 transaction-summary-card">

      <div className="card-body">

        <h6 className="text-muted">
          Failed
        </h6>

        <h3 className="mb-0">
          {failedTransactions}
        </h3>

      </div>

    </div>

  </div>

</div>
          {/* Search & Filters */}

<div className="row mb-4">

  {/* Search */}

  <div className="col-md-4 mb-2">

    <label className="form-label">
      Search
    </label>

    <input
      type="text"
      className="form-control"
      placeholder="Search transactions..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />

  </div>


  {/* Transaction Type */}

  <div className="col-md-4 mb-2">

    <label className="form-label">
      Transaction Type
    </label>

    <select
      className="form-select"
      value={typeFilter}
      onChange={(e) =>
        setTypeFilter(e.target.value)
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

  <div className="col-md-4 mb-2">

    <label className="form-label">
      Status
    </label>

    <select
      className="form-select"
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
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

  <div className="col-md-4 mb-2">

    <label className="form-label">
      From Date
    </label>

    <input
      type="date"
      className="form-control"
      value={dateFrom}
      onChange={(e) =>
        setDateFrom(e.target.value)
      }
    />

  </div>


  {/* To Date */}

  <div className="col-md-4 mb-2">

    <label className="form-label">
      To Date
    </label>

    <input
      type="date"
      className="form-control"
      value={dateTo}
      onChange={(e) =>
        setDateTo(e.target.value)
      }
    />

  </div>


  {/* Reset */}

  <div className="col-md-4 mb-2 d-flex align-items-end">

    <button
      type="button"
      className="btn btn-secondary w-100"
      onClick={() => {
        setSearchTerm("");
        setTypeFilter("ALL");
        setStatusFilter("ALL");
        setDateFrom("");
        setDateTo("");
        setCurrentPage(1);
      }}
    >
      Reset Filters
    </button>

  </div>

</div>
          {/* Loading */}

          {loading && (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >
              </div>

              <p className="mt-3">
                Loading Transactions...
              </p>

            </div>

          )}

          {/* Error */}

          {!loading && error && (

            <div className="alert alert-danger">

              {error}

            </div>

          )}

          {/* Empty */}

          {!loading &&
            !error &&
            filteredTransactions.length === 0 && (

              <div className="alert alert-info">

                No Transactions Found

              </div>

          )}

          {/* Table */}

          {!loading &&
            !error &&
            filteredTransactions.length > 0 && (

            <div className="table-responsive">

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

                  {filteredTransactions.map((tx) => (

                    <tr key={tx.id}>

                      <td>

                        {new Date(
                          tx.created_at
                        ).toLocaleDateString("en-IN")}

                      </td>

                      <td>

                        {tx.transaction_type}

                      </td>

                      <td>

                        ₹
                        {Number(tx.amount).toLocaleString(
                          "en-IN"
                        )}

                      </td>

                      <td>

                        {getStatusBadge(tx.status)}

                      </td>

                      <td>

                        {tx.description || "-"}

                      </td>

                      <td>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            viewTransaction(tx.id)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
              </div>
            </div>

          )}           {/* Pagination */}

          {!loading &&
            !error &&
            filteredTransactions.length > 0 && (

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />

          )}

        </div>

      </div>

      {/* Transaction Details Modal */}

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

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
    if (!searchTerm.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const keyword = searchTerm.toLowerCase();

    const filtered = transactions.filter((tx) => {
      return (
        tx.description?.toLowerCase().includes(keyword) ||
        tx.sender?.toLowerCase().includes(keyword) ||
        tx.receiver?.toLowerCase().includes(keyword)
      );
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

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

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            Transaction History
          </h3>
        </div>

        <div className="card-body">

          {/* Search & Filters */}

          <div className="row mb-4">

            <div className="col-md-4 mb-2">

              <input
                type="text"
                className="form-control"
                placeholder="Search by description, sender or receiver..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <div className="col-md-4 mb-2">

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

            <div className="col-md-4 mb-2">

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

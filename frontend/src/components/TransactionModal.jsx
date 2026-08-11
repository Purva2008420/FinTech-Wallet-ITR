import React from "react";

const TransactionModal = ({ show, transaction, onClose }) => {
  if (!show || !transaction) return null;

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return <span className="badge bg-success">SUCCESS</span>;

      case "FAILED":
        return <span className="badge bg-danger">FAILED</span>;

      case "PENDING":
        return <span className="badge bg-warning text-dark">PENDING</span>;

      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                Transaction Details
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">

              <table className="table table-bordered">

                <tbody>

                  <tr>
                    <th width="35%">Transaction ID</th>
                    <td>{transaction.id}</td>
                  </tr>

                  <tr>
                    <th>Type</th>
                    <td>{transaction.transaction_type}</td>
                  </tr>

                  <tr>
                    <th>Sender</th>
                    <td>{transaction.sender || "-"}</td>
                  </tr>

                  <tr>
                    <th>Receiver</th>
                    <td>{transaction.receiver || "-"}</td>
                  </tr>

                  <tr>
                    <th>Amount</th>
                    <td>
                      ₹
                      {Number(transaction.amount).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>Status</th>
                    <td>{getStatusBadge(transaction.status)}</td>
                  </tr>

                  <tr>
                    <th>Description</th>
                    <td>{transaction.description || "-"}</td>
                  </tr>

                  <tr>
                    <th>Date & Time</th>
                    <td>
                      {new Date(
                        transaction.created_at
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionModal;
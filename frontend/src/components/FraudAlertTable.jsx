import React, { useState } from "react";
import { resolveFraudAlert } from "../api/adminApi";

const FraudAlertTable = ({ alerts, refreshAlerts }) => {
  const [message, setMessage] = useState("");

  const handleResolve = async (id) => {
    try {
      await resolveFraudAlert(id);
      setMessage("Fraud alert resolved successfully.");
      refreshAlerts();
    } catch (error) {
      setMessage("Failed to resolve fraud alert.");
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
        return <span className="badge bg-danger">HIGH</span>;

      case "MEDIUM":
        return <span className="badge bg-warning text-dark">MEDIUM</span>;

      case "LOW":
        return <span className="badge bg-success">LOW</span>;

      default:
        return <span className="badge bg-secondary">{severity}</span>;
    }
  };

  return (
    <div className="card shadow mt-4">

      <div className="card-header bg-danger text-white">
        <h5 className="mb-0">
          Fraud Alerts
        </h5>
      </div>

      <div className="card-body">

        {message && (
          <div className="alert alert-info">
            {message}
          </div>
        )}

        <div className="table-responsive">

          <table className="table table-hover table-bordered">

            <thead className="table-light">

              <tr>

                <th>ID</th>

                <th>User</th>

                <th>Amount</th>

                <th>Reason</th>

                <th>Severity</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {alerts.length === 0 ? (

                <tr>

                  <td colSpan="7" className="text-center">

                    No Fraud Alerts Found

                  </td>

                </tr>

              ) : (

                alerts.map((alert) => (

                  <tr key={alert.id}>

                    <td>{alert.id}</td>

                    <td>{alert.username}</td>

                    <td>
                      ₹
                      {Number(alert.amount).toLocaleString("en-IN")}
                    </td>

                    <td>{alert.reason}</td>

                    <td>
                      {getSeverityBadge(alert.severity)}
                    </td>

                    <td>

                      {alert.is_resolved ? (

                        <span className="badge bg-success">
                          Resolved
                        </span>

                      ) : (

                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>

                      )}

                    </td>

                    <td>

                      {!alert.is_resolved && (

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleResolve(alert.id)
                          }
                        >
                          Resolve
                        </button>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default FraudAlertTable;
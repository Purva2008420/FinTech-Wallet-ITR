import React, { useState } from "react";
import { freezeUser, unfreezeUser } from "../api/adminApi";

const UserTable = ({ users, refreshUsers }) => {
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // Safe Extraction Layer: Handle DRF paginated objects (.results) or raw arrays cleanly
  const userList = Array.isArray(users) ? users : users?.results || [];

  const handleFreeze = async (id) => {
    setLoadingId(id);
    try {
      await freezeUser(id);
      setMessage("User account frozen successfully.");
      refreshUsers();
    } catch (error) {
      setMessage("Failed to freeze user account.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnfreeze = async (id) => {
    setLoadingId(id);
    try {
      await unfreezeUser(id);
      setMessage("User account unfrozen successfully.");
      refreshUsers();
    } catch (error) {
      setMessage("Failed to unfreeze user account.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">User Management Directory</h5>
      </div>

      <div className="card-body">
        {message && (
          <div className="alert alert-info py-2 small text-center fw-semibold">
            {message}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0 small">
            <thead className="table-light text-uppercase font-monospace text-muted">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Role</th>
                <th className="text-center">Action Overrides</th>
              </tr>
            </thead>
            <tbody>
              {userList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted p-4">
                    No active user profiles found in system matrix.
                  </td>
                </tr>
              ) : (
                userList.map((user) => (
                  <tr key={user.id}>
                    <td className="font-monospace fw-bold">#USR-0{user.id}</td>
                    <td className="fw-bold text-dark">{user.username}</td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      {user.is_active ? (
                        <span className="badge bg-success px-2 py-1">🟢 Active</span>
                      ) : (
                        <span className="badge bg-danger px-2 py-1">❄️ Frozen</span>
                      )}
                    </td>
                    <td>
                      {user.is_staff ? (
                        <span className="badge bg-primary px-2 py-1">Admin</span>
                      ) : (
                        <span className="badge bg-secondary px-2 py-1">User</span>
                      )}
                    </td>
                    <td className="text-center">
                      {user.is_staff ? (
                        <span className="text-muted small font-monospace">System Immune</span>
                      ) : user.is_active ? (
                        <button
                          className="btn btn-danger btn-sm fw-bold shadow-sm px-3"
                          onClick={() => handleFreeze(user.id)}
                          disabled={loadingId === user.id}
                        >
                          {loadingId === user.id ? "Processing..." : "Freeze"}
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm fw-bold shadow-sm px-3"
                          onClick={() => handleUnfreeze(user.id)}
                          disabled={loadingId === user.id}
                        >
                          {loadingId === user.id ? "Processing..." : "Unfreeze"}
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

export default UserTable;

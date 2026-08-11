import React, { useMemo, useState } from "react";
import { freezeUser, unfreezeUser } from "../api/adminApi";

const UserTable = ({ users, refreshUsers }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [loadingId, setLoadingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // ==========================================
    // Safely handle paginated or normal response
    // ==========================================

    const userList = Array.isArray(users)
        ? users
        : users?.results || [];

    // ==========================================
    // Search Users
    // ==========================================

    const filteredUsers = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) {
            return userList;
        }

        return userList.filter((user) => {
            return (
                user.username?.toLowerCase().includes(keyword) ||
                user.email?.toLowerCase().includes(keyword) ||
                String(user.id).includes(keyword)
            );
        });
    }, [userList, searchTerm]);

    // ==========================================
    // Freeze User
    // ==========================================

    const handleFreeze = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to freeze this user account?"
        );

        if (!confirmed) {
            return;
        }

        setLoadingId(id);
        setMessage("");

        try {
            await freezeUser(id);

            setMessage(
                "User account frozen successfully."
            );

            setMessageType("success");

            await refreshUsers();

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.error ||
                "Failed to freeze user account."
            );

            setMessageType("danger");

        } finally {
            setLoadingId(null);
        }
    };

    // ==========================================
    // Unfreeze User
    // ==========================================

    const handleUnfreeze = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to unfreeze this user account?"
        );

        if (!confirmed) {
            return;
        }

        setLoadingId(id);
        setMessage("");

        try {
            await unfreezeUser(id);

            setMessage(
                "User account unfrozen successfully."
            );

            setMessageType("success");

            await refreshUsers();

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.error ||
                "Failed to unfreeze user account."
            );

            setMessageType("danger");

        } finally {
            setLoadingId(null);
        }
    };

    // ==========================================
    // Refresh Users
    // ==========================================

    const handleRefresh = async () => {
        setMessage("");

        try {
            await refreshUsers();

            setMessage(
                "User list refreshed successfully."
            );

            setMessageType("success");

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to refresh user list."
            );

            setMessageType("danger");
        }
    };

    // ==========================================
    // Count Statistics
    // ==========================================

    const totalUsers = userList.length;

    const activeUsers = userList.filter(
        (user) => !user.is_frozen
    ).length;

    const frozenUsers = userList.filter(
        (user) => user.is_frozen
    ).length;

    const adminUsers = userList.filter(
        (user) => user.is_staff
    ).length;

    return (
        <div className="card shadow-sm border-0 mt-4">

            {/* ======================================
                Header
            ====================================== */}

            <div className="card-header bg-dark text-white p-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div>

                        <h5 className="fw-bold mb-1">
                            👥 User Management
                        </h5>

                        <p className="small text-white-50 mb-0">
                            Manage registered users and account security.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="btn btn-light btn-sm fw-bold"
                        onClick={handleRefresh}
                    >
                        🔄 Refresh Users
                    </button>

                </div>

            </div>


            <div className="card-body p-4">

                {/* ======================================
                    Message
                ====================================== */}

                {message && (
                    <div
                        className={`alert alert-${messageType} py-2 small fw-semibold`}
                    >
                        {message}
                    </div>
                )}


                {/* ======================================
                    Statistics
                ====================================== */}

                <div className="row g-3 mb-4">

                    {/* Total */}

                    <div className="col-md-3">

                        <div className="border rounded-3 p-3 h-100">

                            <div className="text-muted small">
                                Total Users
                            </div>

                            <h4 className="fw-bold mb-0 mt-1">
                                👥 {totalUsers}
                            </h4>

                        </div>

                    </div>


                    {/* Active */}

                    <div className="col-md-3">

                        <div className="border rounded-3 p-3 h-100">

                            <div className="text-muted small">
                                Active Users
                            </div>

                            <h4 className="fw-bold text-success mb-0 mt-1">
                                🟢 {activeUsers}
                            </h4>

                        </div>

                    </div>


                    {/* Frozen */}

                    <div className="col-md-3">

                        <div className="border rounded-3 p-3 h-100">

                            <div className="text-muted small">
                                Frozen Accounts
                            </div>

                            <h4 className="fw-bold text-danger mb-0 mt-1">
                                ❄️ {frozenUsers}
                            </h4>

                        </div>

                    </div>


                    {/* Administrators */}

                    <div className="col-md-3">

                        <div className="border rounded-3 p-3 h-100">

                            <div className="text-muted small">
                                Administrators
                            </div>

                            <h4 className="fw-bold text-primary mb-0 mt-1">
                                🛡️ {adminUsers}
                            </h4>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    Search
                ====================================== */}

                <div className="row mb-4">

                    <div className="col-md-8">

                        <label className="form-label fw-semibold">
                            Search Users
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by username, email or ID..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>


                    <div className="col-md-4 d-flex align-items-end">

                        <div className="text-muted small">

                            Showing{" "}
                            <strong>
                                {filteredUsers.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {totalUsers}
                            </strong>{" "}
                            users

                        </div>

                    </div>

                </div>


                {/* ======================================
                    User Table
                ====================================== */}

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Role
                                </th>

                                <th className="text-center">
                                    Account Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-5"
                                    >

                                        <div className="fs-2 mb-2">
                                            🔍
                                        </div>

                                        <strong>
                                            No users found
                                        </strong>

                                        <div className="small mt-1">
                                            Try changing your search.
                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        {/* ID */}

                                        <td>
                                            <span className="font-monospace fw-bold">
                                                #{user.id}
                                            </span>
                                        </td>


                                        {/* User */}

                                        <td>

                                            <div className="d-flex align-items-center gap-2">

                                                <div
                                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                    }}
                                                >
                                                    {user.username
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>

                                                    <div className="fw-bold">
                                                        {user.username}
                                                    </div>

                                                    <small className="text-muted">
                                                        User ID: {user.id}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Email */}

                                        <td>
                                            <span className="text-muted">
                                                {user.email || "-"}
                                            </span>
                                        </td>


                                        {/* Status */}

                                        <td>

                                            {user.is_frozen ? (

                                                <span className="badge bg-danger px-3 py-2">
                                                    ❄️ Frozen
                                                </span>

                                            ) : (

                                                <span className="badge bg-success px-3 py-2">
                                                    🟢 Active
                                                </span>

                                            )}

                                        </td>


                                        {/* Role */}

                                        <td>

                                            {user.is_staff ? (

                                                <span className="badge bg-primary px-3 py-2">
                                                    🛡️ Administrator
                                                </span>

                                            ) : (

                                                <span className="badge bg-secondary px-3 py-2">
                                                    👤 User
                                                </span>

                                            )}

                                        </td>


                                        {/* Actions */}

                                        <td className="text-center">

                                            {user.is_staff ? (

                                                <span className="badge bg-light text-dark border px-3 py-2">
                                                    🔒 Admin Protected
                                                </span>

                                            ) : !user.is_frozen ? (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm fw-bold px-3"
                                                    onClick={() =>
                                                        handleFreeze(user.id)
                                                    }
                                                    disabled={
                                                        loadingId === user.id
                                                    }
                                                >

                                                    {loadingId === user.id
                                                        ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-1"
                                                                    role="status"
                                                                ></span>

                                                                Processing...
                                                            </>
                                                        )
                                                        : (
                                                            "❄️ Freeze"
                                                        )}

                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm fw-bold px-3"
                                                    onClick={() =>
                                                        handleUnfreeze(user.id)
                                                    }
                                                    disabled={
                                                        loadingId === user.id
                                                    }
                                                >

                                                    {loadingId === user.id
                                                        ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-1"
                                                                    role="status"
                                                                ></span>

                                                                Processing...
                                                            </>
                                                        )
                                                        : (
                                                            "🔓 Unfreeze"
                                                        )}

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

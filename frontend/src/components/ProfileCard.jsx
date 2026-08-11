import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({
    profile,
    onEdit,
    onChangePassword,
}) => {

    // ============================
    // Loading State
    // ============================

    if (!profile) {
        return (
            <div className="card shadow-sm border-0 p-4 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="text-muted mt-3 mb-0">
                    Loading profile...
                </p>
            </div>
        );
    }

    // ============================
    // Determine User Role
    // ============================

    const isAdmin =
        profile.is_staff === true ||
        profile.is_superuser === true;

    return (
        <div className="profile-page">

            {/* ==================================================
                PROFILE HEADER
            ================================================== */}

            <div
                className="card border-0 shadow-sm mb-4 overflow-hidden"
                style={{ borderRadius: "18px" }}
            >

                <div
                    className="p-4 text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #0d6efd 0%, #274c9b 100%)",
                    }}
                >

                    <div className="d-flex flex-column flex-md-row align-items-md-center">

                        {/* Avatar */}

                        <div
                            className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold shadow me-md-4 mb-3 mb-md-0"
                            style={{
                                width: "80px",
                                height: "80px",
                                fontSize: "30px",
                            }}
                        >
                            {profile.username
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>


                        {/* User Information */}

                        <div className="flex-grow-1">

                            <h3 className="fw-bold mb-1">

                                {profile.first_name ||
                                    profile.username}

                                {profile.last_name
                                    ? ` ${profile.last_name}`
                                    : ""}

                            </h3>


                            <p className="mb-2 text-white-50">
                                @{profile.username}
                            </p>


                            {/* Role + Status */}

                            <div className="d-flex flex-wrap gap-2">

                                <span className="badge bg-light text-dark px-3 py-2">

                                    {isAdmin
                                        ? "🛡️ Administrator"
                                        : "👤 User"}

                                </span>


                                <span className="badge bg-success px-3 py-2">

                                    🟢 Active Account

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ACCOUNT INFORMATION
            ================================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "18px" }}
            >

                <div className="card-header bg-white border-0 pt-4 px-4">

                    <h5 className="fw-bold mb-1">
                        Account Information
                    </h5>

                    <p className="text-muted small mb-0">
                        Your registered account details.
                    </p>

                </div>


                <div className="card-body p-4">

                    <div className="row g-4">

                        {/* Username */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    Username
                                </span>

                                <div className="fw-semibold mt-1">
                                    {profile.username || "-"}
                                </div>

                            </div>

                        </div>


                        {/* Email */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    Email Address
                                </span>

                                <div className="fw-semibold mt-1">
                                    {profile.email || "-"}
                                </div>

                            </div>

                        </div>


                        {/* First Name */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    First Name
                                </span>

                                <div className="fw-semibold mt-1">
                                    {profile.first_name || "-"}
                                </div>

                            </div>

                        </div>


                        {/* Last Name */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    Last Name
                                </span>

                                <div className="fw-semibold mt-1">
                                    {profile.last_name || "-"}
                                </div>

                            </div>

                        </div>


                        {/* Account Role */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    Account Role
                                </span>

                                <div className="fw-semibold mt-1">

                                    {isAdmin
                                        ? "Administrator"
                                        : "Standard User"}

                                </div>

                            </div>

                        </div>


                        {/* Account Status */}

                        <div className="col-md-6">

                            <div className="profile-info-box">

                                <span className="text-muted small">
                                    Account Status
                                </span>

                                <div className="fw-semibold text-success mt-1">
                                    ● Active
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                SECURITY CENTER
            ================================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "18px" }}
            >

                <div className="card-header bg-white border-0 pt-4 px-4">

                    <h5 className="fw-bold mb-1">
                        🔐 Security Center
                    </h5>

                    <p className="text-muted small mb-0">
                        Manage your account security settings.
                    </p>

                </div>


                <div className="card-body p-4">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                        <div>

                            <h6 className="fw-bold mb-1">
                                Password
                            </h6>

                            <p className="text-muted small mb-0">
                                Keep your account protected with a secure password.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn btn-warning fw-bold px-4"
                            onClick={onChangePassword}
                        >
                            🔑 Change Password
                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ADMINISTRATOR ACCESS
            ================================================== */}

            {isAdmin && (

                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{ borderRadius: "18px" }}
                >

                    <div className="card-body p-4">

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    🛡️ Administrator Access
                                </h5>

                                <p className="text-muted small mb-0">
                                    Your account has administrative access
                                    to the FinTech Vault system.
                                </p>

                            </div>


                            <Link
                                to="/admin"
                                className="btn btn-primary fw-bold px-4"
                            >
                                Admin Dashboard →
                            </Link>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                PROFILE ACTIONS
            ================================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "18px" }}
            >

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-1">
                        ⚙️ Profile Actions
                    </h5>

                    <p className="text-muted small mb-3">
                        Manage your personal information and account security.
                    </p>


                    <div className="d-flex flex-wrap gap-3">

                        {/* Edit Profile */}

                        <button
                            type="button"
                            className="btn btn-primary fw-bold px-4"
                            onClick={onEdit}
                        >
                            ✏️ Edit Profile
                        </button>


                        {/* Change Password */}

                        <button
                            type="button"
                            className="btn btn-outline-warning fw-bold px-4"
                            onClick={onChangePassword}
                        >
                            🔑 Change Password
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProfileCard;
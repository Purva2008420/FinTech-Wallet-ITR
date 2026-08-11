import React, { useState } from "react";

const ChangePasswordModal = ({ show, onClose, onSave }) => {
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSave = async () => {
        setError("");

        if (!passwords.old_password || !passwords.new_password) {
            setError("Please fill in both password fields.");
            return;
        }

        if (passwords.new_password.length < 8) {
            setError("New password must contain at least 8 characters.");
            return;
        }

        if (passwords.new_password !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setSaving(true);

        try {
            await onSave(passwords);

            setPasswords({
                old_password: "",
                new_password: "",
            });

            setConfirmPassword("");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (saving) return;

        setPasswords({
            old_password: "",
            new_password: "",
        });

        setConfirmPassword("");
        setError("");

        onClose();
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div
                className="modal d-block"
                tabIndex="-1"
                role="dialog"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div
                        className="modal-content border-0 shadow-lg"
                        style={{ borderRadius: "18px" }}
                    >

                        {/* Header */}
                        <div
                            className="modal-header text-white border-0"
                            style={{
                                background:
                                    "linear-gradient(135deg, #f59f00 0%, #d97706 100%)",
                            }}
                        >
                            <div>
                                <h5 className="modal-title fw-bold mb-1">
                                    🔐 Change Password
                                </h5>

                                <small className="text-white-50">
                                    Protect your FinTech Vault account
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={handleClose}
                                disabled={saving}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4">

                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Current Password */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="old_password"
                                    className="form-control"
                                    placeholder="Enter current password"
                                    value={passwords.old_password}
                                    onChange={handleChange}
                                    disabled={saving}
                                />
                            </div>

                            {/* New Password */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="new_password"
                                    className="form-control"
                                    placeholder="Enter new password"
                                    value={passwords.new_password}
                                    onChange={handleChange}
                                    disabled={saving}
                                />

                                <small className="text-muted">
                                    Use at least 8 characters.
                                </small>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError("");
                                    }}
                                    disabled={saving}
                                />
                            </div>

                            {/* Security Notice */}
                            <div className="alert alert-light border small mb-0">
                                🔒 After changing your password, keep it private
                                and do not share it with anyone.
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 px-4 pb-4">

                            <button
                                type="button"
                                className="btn btn-light border fw-semibold px-4"
                                onClick={handleClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-warning fw-bold px-4"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordModal;
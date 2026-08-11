import React, { useEffect, useState } from "react";

const EditProfileModal = ({ show, profile, onClose, onSave }) => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setForm({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            await onSave(form);
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
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
                                    "linear-gradient(135deg, #0d6efd 0%, #274c9b 100%)",
                            }}
                        >
                            <div>
                                <h5 className="modal-title fw-bold mb-1">
                                    ✏️ Edit Profile
                                </h5>

                                <small className="text-white-50">
                                    Update your personal information
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                disabled={saving}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4">

                            {/* Username - Read Only */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={profile?.username || ""}
                                    disabled
                                />

                                <small className="text-muted">
                                    Username cannot be changed.
                                </small>
                            </div>

                            {/* First Name */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 px-4 pb-4">

                            <button
                                type="button"
                                className="btn btn-light border fw-semibold px-4"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary fw-bold px-4"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfileModal;
import React, { useState, useEffect } from "react";

const EditProfileModal = ({ show, profile, onClose, onSave }) => {

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

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

    if (!show) return null;

    return (

        <div className="modal d-block">

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5>Edit Profile</h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <input
                            className="form-control mb-3"
                            name="first_name"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            name="last_name"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={() => onSave(form)}
                        >
                            Save
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default EditProfileModal;
import React, { useState } from "react";

const ChangePasswordModal = ({ show, onClose, onSave }) => {

    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
    });

    const handleChange = (e) => {

        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });

    };

    if (!show) return null;

    return (

        <div className="modal d-block">

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5>Change Password</h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <input
                            type="password"
                            name="old_password"
                            className="form-control mb-3"
                            placeholder="Current Password"
                            value={passwords.old_password}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="new_password"
                            className="form-control"
                            placeholder="New Password"
                            value={passwords.new_password}
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
                            onClick={() => onSave(passwords)}
                        >
                            Change Password
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ChangePasswordModal;
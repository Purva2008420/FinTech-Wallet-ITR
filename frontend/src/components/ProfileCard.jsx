import React from "react";

const ProfileCard = ({ profile, onEdit, onChangePassword }) => {
    if (!profile) {
        return (
            <div className="alert alert-info">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="card shadow mt-4">

            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">👤 My Profile</h4>
            </div>

            <div className="card-body">

                <div className="row mb-3">
                    <div className="col-md-6">
                        <strong>Username</strong>
                        <p>{profile.username}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Email</strong>
                        <p>{profile.email}</p>
                    </div>
                </div>

                <div className="row mb-3">

                    <div className="col-md-6">
                        <strong>First Name</strong>
                        <p>{profile.first_name || "-"}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Last Name</strong>
                        <p>{profile.last_name || "-"}</p>
                    </div>

                </div>

                <div className="mt-4">

                    <button
                        className="btn btn-primary me-2"
                        onClick={onEdit}
                    >
                        Edit Profile
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={onChangePassword}
                    >
                        Change Password
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProfileCard;
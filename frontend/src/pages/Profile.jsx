import React, { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../api/profileApi";

import ProfileCard from "../components/ProfileCard";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import Navbar from "../components/Navbar";

import "../styles/profile.css";

const Profile = () => {

    const [profile, setProfile] = useState(null);

    const [showEdit, setShowEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const [loading, setLoading] = useState(true);

    // ============================
    // Load Profile
    // ============================

    const loadProfile = async () => {

        try {

            setLoading(true);

            const data = await getProfile();

            console.log("PROFILE DATA:", data);

            setProfile(data);

        } catch (error) {

            console.error("Profile loading error:", error);

            setMessage("Unable to load profile.");
            setMessageType("danger");

        } finally {

            setLoading(false);

        }

    };

    // ============================
    // Load Profile on Page Open
    // ============================

    useEffect(() => {

        loadProfile();

    }, []);

    // ============================
    // Update Profile
    // ============================

    const handleProfileUpdate = async (formData) => {

        try {

            await updateProfile(formData);

            setShowEdit(false);

            setMessage("Profile updated successfully.");
            setMessageType("success");

            await loadProfile();

        } catch (error) {

            console.error("Profile update error:", error);

            setMessage(
                error.response?.data?.error ||
                "Profile update failed."
            );

            setMessageType("danger");

        }

    };

    // ============================
    // Change Password
    // ============================

    const handlePasswordChange = async (passwordData) => {

        try {

            await changePassword(passwordData);

            setShowPassword(false);

            setMessage("Password changed successfully.");
            setMessageType("success");

        } catch (error) {

            console.error("Password change error:", error);

            setMessage(
                error.response?.data?.error ||
                "Password change failed."
            );

            setMessageType("danger");

        }

    };

    // ============================
    // Loading Screen
    // ============================

    if (loading) {

        return (
            <div>

                <Navbar />

                <div className="container profile-page py-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <h5 className="mt-3">
                        Loading your profile...
                    </h5>

                    <p className="text-muted small">
                        Fetching your account information.
                    </p>

                </div>

            </div>
        );

    }

    return (

        <div>

            <Navbar />

            <div className="container profile-page py-4">

                {/* ============================
                    Profile Header
                ============================ */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            👤 My Profile
                        </h2>

                        <p className="text-muted mb-0">
                            Manage your personal information and account security.
                        </p>

                    </div>

                    {profile && (

                        <span
                            className={`badge ${
                                profile.is_staff
                                    ? "bg-primary"
                                    : "bg-secondary"
                            } px-3 py-2`}
                        >

                            {profile.is_staff
                                ? "🛡️ Administrator"
                                : "👤 User"}

                        </span>

                    )}

                </div>


                {/* ============================
                    Messages
                ============================ */}

                {message && (

                    <div
                        className={`alert alert-${messageType} alert-dismissible fade show`}
                        role="alert"
                    >

                        {message}

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setMessage("")}
                        />

                    </div>

                )}


                {/* ============================
                    Profile Card
                ============================ */}

                <ProfileCard
                    profile={profile}
                    onEdit={() => setShowEdit(true)}
                    onChangePassword={() => setShowPassword(true)}
                />


                {/* ============================
                    Account Information
                ============================ */}

                {profile && (

                    <div className="card shadow-sm border-0 mt-4">

                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-1">
                                🛡️ Account Security
                            </h5>

                            <p className="text-muted small">
                                Overview of your account security status.
                            </p>

                            <hr />

                            <div className="row g-3">

                                {/* Role */}

                                <div className="col-md-4">

                                    <div className="profile-info-box">

                                        <span className="text-muted small d-block">
                                            Account Role
                                        </span>

                                        <strong>
                                            {profile.is_staff
                                                ? "🛡️ Administrator"
                                                : "👤 User"}
                                        </strong>

                                    </div>

                                </div>


                                {/* Account Status */}

                                <div className="col-md-4">

                                    <div className="profile-info-box">

                                        <span className="text-muted small d-block">
                                            Account Status
                                        </span>

                                        <strong
                                            className={
                                                profile.is_frozen
                                                    ? "text-danger"
                                                    : "text-success"
                                            }
                                        >

                                            {profile.is_frozen
                                                ? "🔒 Frozen"
                                                : "🟢 Active"}

                                        </strong>

                                    </div>

                                </div>


                                {/* Authentication */}

                                <div className="col-md-4">

                                    <div className="profile-info-box">

                                        <span className="text-muted small d-block">
                                            Authentication
                                        </span>

                                        <strong>
                                            🔐 JWT Protected
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* ============================
                    Modals
                ============================ */}

                <EditProfileModal
                    show={showEdit}
                    profile={profile}
                    onClose={() => setShowEdit(false)}
                    onSave={handleProfileUpdate}
                />

                <ChangePasswordModal
                    show={showPassword}
                    onClose={() => setShowPassword(false)}
                    onSave={handlePasswordChange}
                />

            </div>

        </div>

    );

};

export default Profile;
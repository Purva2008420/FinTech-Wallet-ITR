import React, { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../api/profileApi";

import ProfileCard from "../components/ProfileCard";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

import "../styles/profile.css";

const Profile = () => {

    const [profile, setProfile] = useState(null);

    const [showEdit, setShowEdit] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");

    const loadProfile = async () => {

        try {

            const data = await getProfile();

            setProfile(data);

        } catch (error) {

            console.error(error);

            setMessage("Unable to load profile.");

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    const handleProfileUpdate = async (formData) => {

        try {

            await updateProfile(formData);

            setShowEdit(false);

            setMessage("Profile updated successfully.");

            loadProfile();

        } catch (error) {

            console.error(error);

            setMessage("Profile update failed.");

        }

    };

    const handlePasswordChange = async (passwordData) => {

        try {

            await changePassword(passwordData);

            setShowPassword(false);

            setMessage("Password changed successfully.");

        } catch (error) {

            console.error(error);

            setMessage("Password change failed.");

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                👤 My Profile
            </h2>

            {message && (

                <div className="alert alert-info">

                    {message}

                </div>

            )}

            <ProfileCard
                profile={profile}
                onEdit={() => setShowEdit(true)}
                onChangePassword={() => setShowPassword(true)}
            />

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

    );

};

export default Profile;
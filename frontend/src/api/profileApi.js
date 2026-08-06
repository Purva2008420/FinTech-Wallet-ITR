import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
    return localStorage.getItem("access");
};

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// ------------------------
// Profile
// ------------------------

export const getProfile = async () => {
    const response = await axios.get(
        `${BASE_URL}/profile/`,
        authHeaders()
    );

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axios.put(
        `${BASE_URL}/profile/`,
        data,
        authHeaders()
    );

    return response.data;
};

export const changePassword = async (data) => {
    const response = await axios.post(
        `${BASE_URL}/profile/change-password/`,
        data,
        authHeaders()
    );

    return response.data;
};

// ------------------------
// Analytics
// ------------------------

export const getAnalytics = async () => {
    const response = await axios.get(
        `${BASE_URL}/analytics/dashboard/`,
        authHeaders()
    );

    return response.data;
};
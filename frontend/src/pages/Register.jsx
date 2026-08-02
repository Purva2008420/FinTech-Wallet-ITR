import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await api.post("accounts/register/", formData);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.username?.[0] || "Registration failed. Try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "420px", borderRadius: "12px" }}>
                <h3 className="text-center mb-3 text-primary fw-bold">Join FinTech Vault</h3>
                <p className="text-center text-muted small mb-4">Create your secure financial wallet container account</p>
                {error && <div className="alert alert-danger p-2 text-center small">{error}</div>}
                {success && <div className="alert alert-success p-2 text-center small">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Username</label>
                        <input type="text" className="form-control" name="username" required value={formData.username} onChange={handleChange} placeholder="Choose username" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Email Address</label>
                        <input type="email" className="form-control" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Phone Number</label>
                        <input type="text" className="form-control" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Enter 10-digit number" />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-semibold">Secure Password</label>
                        <input type="password" className="form-control" name="password" required value={formData.password} onChange={handleChange} placeholder="Create password" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3">Register Account</button>
                </form>
                <p className="text-center text-muted small mb-0">Already registered? <Link to="/login" className="text-decoration-none fw-semibold">Sign In</Link></p>
            </div>
        </div>
    );
};

export default Register;

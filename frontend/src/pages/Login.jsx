import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await loginUser(username, password);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "12px" }}>
                <h2 className="text-center mb-4 text-primary fw-bold">FinTech Vault</h2>
                <h5 className="text-center text-muted mb-4">Account Secure Login</h5>
                {error && <div className="alert alert-danger p-2 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" className="form-control" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3">Sign In</button>
                </form>
                <p className="text-center text-muted small">New to the platform? <Link to="/register" className="text-decoration-none fw-semibold">Create account</Link></p>
            </div>
        </div>
    );
};

export default Login;

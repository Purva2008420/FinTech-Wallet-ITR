import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
                <div>
                    <h1 className="text-primary fw-bold mb-0">FinTech Vault</h1>
                    <p className="text-muted mb-0">Secure Financial Management Dashboard</p>
                </div>
                <button className="btn btn-outline-danger fw-bold px-4 py-2 shadow-sm" onClick={handleLogout}>
                    Secure Logout
                </button>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow border-0" style={{ borderRadius: "16px", backgroundColor: "#f8f9fa" }}>
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-3 me-3" style={{ width: "60px", height: "60px" }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold text-dark">Welcome back, {user?.username}!</h3>
                                <p className="text-success fw-semibold mb-0 small">✓ Premium Wallet Account Verified</p>
                            </div>
                        </div>

                        <h5 className="border-bottom pb-2 mb-3 text-secondary fw-semibold">Profile Matrix Details</h5>
                        <div className="mb-2 d-flex justify-content-between">
                            <span className="text-muted">Registered Email:</span>
                            <span className="fw-semibold text-dark">{user?.email}</span>
                        </div>
                        <div className="mb-4 d-flex justify-content-between">
                            <span className="text-muted">Linked Mobile Phone:</span>
                            <span className="fw-semibold text-dark">{user?.phone || "Not Provided"}</span>
                        </div>

                        <div className="alert alert-info border-0 p-3 mb-0" style={{ borderRadius: "12px" }}>
                            <h6 className="fw-bold mb-1">💡 Pro-Tip Enhancement Track</h6>
                            <p className="small mb-0 text-muted">Tomorrow on Day 15, we will link your automated 16-digit wallet balance module grid right into this view window matrix wrapper panel!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

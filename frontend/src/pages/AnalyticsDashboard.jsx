import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import AnalyticsCards from "../components/AnalyticsCards";
import TransactionChart from "../components/TransactionChart";
import TransactionTypeChart from "../components/TransactionTypeChart";
import FraudAnalyticsChart from "../components/FraudAnalyticsChart";

import { getAnalytics } from "../api/profileApi";

import "../styles/analytics.css";

const AnalyticsDashboard = () => {

    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAnalytics();

            console.log("ANALYTICS DATA:", data);

            setAnalytics(data);

        } catch (err) {

            console.error(
                "Analytics Error:",
                err
            );

            setError(
                "Unable to load analytics dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadAnalytics();

    }, []);

    return (
        <div>

            <Navbar />

            <div className="container analytics-page py-4">

                {/* Header */}

                <div className="analytics-header mb-4">

                    <div>
                        <h2>
                            📊 Analytics Dashboard
                        </h2>

                        <p>
                            Monitor transaction activity,
                            financial flow and fraud status.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline-primary"
                        onClick={loadAnalytics}
                    >
                        🔄 Refresh
                    </button>

                </div>

                {/* Error */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Loading */}

                {loading ? (

                    <div className="analytics-loading">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p>
                            Loading analytics...
                        </p>

                    </div>

                ) : (

                    <>
                        {/* Summary Cards */}

                        <AnalyticsCards
                            analytics={analytics}
                        />

                        {/* Amount Chart */}

                        <div className="row g-4 mt-1">

                            <div className="col-12">

                                <TransactionChart
                                    analytics={analytics}
                                />

                            </div>

                        </div>

                        {/* Distribution Charts */}

                        <div className="row g-4 mt-1">

                            <div className="col-lg-6">

                                <TransactionTypeChart
                                    analytics={analytics}
                                />

                            </div>

                            <div className="col-lg-6">

                                <FraudAnalyticsChart
                                    analytics={analytics}
                                />

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>
    );
};

export default AnalyticsDashboard;
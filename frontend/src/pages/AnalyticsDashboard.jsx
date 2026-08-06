import React, { useEffect, useState } from "react";

import { getAnalytics } from "../api/profileApi";

import AnalyticsCards from "../components/AnalyticsCards";
import TransactionChart from "../components/TransactionChart";
import TransactionTypeChart from "../components/TransactionTypeChart";
import FraudAnalyticsChart from "../components/FraudAnalyticsChart";

const AnalyticsDashboard = () => {

    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadAnalytics = async () => {

        try {

            const data = await getAnalytics();

            setAnalytics(data);

        } catch (err) {

            console.error(err);

            setError("Unable to load analytics.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAnalytics();

    }, []);

    if (loading) {

        return (

            <div className="container mt-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                </div>

                <h5 className="mt-3">
                    Loading Analytics...
                </h5>

            </div>

        );

    }

    if (error) {

        return (

            <div className="container mt-5">

                <div className="alert alert-danger">

                    {error}

                </div>

            </div>

        );

    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">

                📊 Analytics Dashboard

            </h2>

            <AnalyticsCards analytics={analytics} />

            <TransactionChart analytics={analytics} />

            <TransactionTypeChart analytics={analytics} />

            <FraudAnalyticsChart analytics={analytics} />

        </div>

    );

};

export default AnalyticsDashboard;
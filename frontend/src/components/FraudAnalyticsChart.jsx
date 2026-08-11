import React from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const FraudAnalyticsChart = ({ analytics }) => {

    if (!analytics) {
        return null;
    }

    const successful = Number(
        analytics.successful_transactions || 0
    );

    const pending = Number(
        analytics.pending_transactions || 0
    );

    const failed = Number(
        analytics.failed_transactions || 0
    );

    const fraud = Number(
        analytics.fraud_alerts || 0
    );

    const data = {
        labels: [
            "Successful",
            "Pending",
            "Failed",
            "Fraud Alerts",
        ],

        datasets: [
            {
                data: [
                    successful,
                    pending,
                    failed,
                    fraud,
                ],

                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545",
                    "#6f42c1",
                ],

                borderColor: "#ffffff",

                borderWidth: 3,

                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        cutout: "58%",

        plugins: {
            legend: {
                position: "bottom",

                labels: {
                    padding: 18,
                    usePointStyle: true,
                },
            },
        },
    };

    return (
        <div className="analytics-chart-card">

            <div className="analytics-section-title">
                <div>
                    <h5>🚨 Transaction & Fraud Status</h5>

                    <p>
                        Overall transaction health and fraud activity
                    </p>
                </div>
            </div>

            <div className="analytics-pie-container">

                <Doughnut
                    data={data}
                    options={options}
                />

            </div>

        </div>
    );
};

export default FraudAnalyticsChart;
import React from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const TransactionTypeChart = ({ analytics }) => {

    if (!analytics) {
        return null;
    }

    const depositCount = Number(
        analytics.deposit_count || 0
    );

    const withdrawCount = Number(
        analytics.withdraw_count || 0
    );

    const transferCount = Number(
        analytics.transfer_count || 0
    );

    const total =
        depositCount +
        withdrawCount +
        transferCount;

    const data = {
        labels: [
            "Deposits",
            "Withdrawals",
            "Transfers",
        ],

        datasets: [
            {
                data: [
                    depositCount,
                    withdrawCount,
                    transferCount,
                ],

                backgroundColor: [
                    "#198754",
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

        plugins: {
            legend: {
                position: "bottom",

                labels: {
                    padding: 20,
                    usePointStyle: true,
                },
            },

            tooltip: {
                callbacks: {
                    label: function (context) {

                        const value = context.raw;

                        const percentage =
                            total > 0
                                ? ((value / total) * 100).toFixed(1)
                                : 0;

                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="analytics-chart-card">

            <div className="analytics-section-title">
                <div>
                    <h5>📊 Transaction Distribution</h5>
                    <p>
                        Distribution by transaction type
                    </p>
                </div>
            </div>

            <div className="analytics-pie-container">
                <Pie
                    data={data}
                    options={options}
                />
            </div>

        </div>
    );
};

export default TransactionTypeChart;
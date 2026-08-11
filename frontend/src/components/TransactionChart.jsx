import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const TransactionChart = ({ analytics }) => {

    if (!analytics) {
        return null;
    }

    const deposit = Number(analytics.total_deposit || 0);
    const withdraw = Number(analytics.total_withdraw || 0);
    const transfer = Number(analytics.total_transfer || 0);

    console.log("Transaction Chart Values:", {
        deposit,
        withdraw,
        transfer,
    });

    const data = {
        labels: [
            "Deposits",
            "Withdrawals",
            "Transfers",
        ],

        datasets: [
            {
                label: "Transaction Amount (₹)",

                data: [
                    deposit,
                    withdraw,
                    transfer,
                ],

                backgroundColor: [
                    "#198754",
                    "#dc3545",
                    "#6f42c1",
                ],

                borderColor: [
                    "#146c43",
                    "#b02a37",
                    "#59359a",
                ],

                borderWidth: 1,

                borderRadius: 8,

                barThickness: 70,
            },
        ],
    };

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ₹${Number(
                            context.raw
                        ).toLocaleString("en-IN")}`;
                    },
                },
            },
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: function (value) {
                        return "₹" +
                            Number(value).toLocaleString("en-IN");
                    },
                },

                title: {
                    display: true,
                    text: "Amount (₹)",
                },
            },

            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="analytics-chart-card">

            <div className="analytics-section-title">
                <div>
                    <h5>💰 Transaction Amount Overview</h5>
                    <p>
                        Compare deposits, withdrawals and transfers
                    </p>
                </div>
            </div>

            <div className="analytics-bar-container">
                <Bar
                    data={data}
                    options={options}
                />
            </div>

        </div>
    );
};

export default TransactionChart;
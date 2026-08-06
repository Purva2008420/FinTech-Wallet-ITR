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

    const data = {
        labels: [
            "Deposits",
            "Withdrawals",
            "Transfers",
        ],

        datasets: [
            {
                label: "Amount (₹)",

                data: [
                    Number(analytics.total_deposit),
                    Number(analytics.total_withdraw),
                    Number(analytics.total_transfer),
                ],
            },
        ],
    };

    const options = {
        responsive: true,

        plugins: {
            legend: {
                display: true,
            },
        },

        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="card shadow mt-4">

            <div className="card-header bg-primary text-white">

                <h5 className="mb-0">
                    Transaction Overview
                </h5>

            </div>

            <div className="card-body">

                <Bar
                    data={data}
                    options={options}
                />

            </div>

        </div>
    );
};

export default TransactionChart;
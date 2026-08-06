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

    const data = {
        labels: [
            "Deposits",
            "Withdrawals",
            "Transfers",
        ],

        datasets: [
            {
                data: [
                    Number(analytics.total_deposit),
                    Number(analytics.total_withdraw),
                    Number(analytics.total_transfer),
                ],
            },
        ],
    };

    return (
        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                <h5 className="mb-0">
                    Transaction Distribution
                </h5>

            </div>

            <div className="card-body">

                <Pie data={data} />

            </div>

        </div>
    );
};

export default TransactionTypeChart;
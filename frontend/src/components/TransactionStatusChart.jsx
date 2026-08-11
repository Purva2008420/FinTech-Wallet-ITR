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

const TransactionStatusChart = ({ analytics }) => {

    if (!analytics) {
        return null;
    }

    const data = {
        labels: [
            "Successful",
            "Pending",
            "Failed",
        ],

        datasets: [
            {
                data: [
                    Number(analytics.successful_transactions),
                    Number(analytics.pending_transactions),
                    Number(analytics.failed_transactions),
                ],

                backgroundColor: [
                    "#198754", // SUCCESS - green
                    "#ffc107", // PENDING - yellow
                    "#dc3545", // FAILED - red
                ],

                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="card shadow mt-4">

            <div className="card-header bg-dark text-white">

                <h5 className="mb-0">
                    Transaction Status Distribution
                </h5>

            </div>

            <div className="card-body">

                <Pie data={data} />

            </div>

        </div>
    );
};

export default TransactionStatusChart;
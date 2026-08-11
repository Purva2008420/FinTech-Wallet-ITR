import React from "react";

const AnalyticsCards = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="alert alert-info">
                Loading analytics...
            </div>
        );
    }

    const cards = [
        {
            title: "Total Transactions",
            value: analytics.total_transactions ?? 0,
            icon: "💳",
            className: "analytics-blue",
        },
        {
            title: "Total Deposits",
            value: `₹${Number(analytics.total_deposit || 0).toLocaleString("en-IN")}`,
            icon: "⬇️",
            className: "analytics-green",
        },
        {
            title: "Total Withdrawals",
            value: `₹${Number(analytics.total_withdraw || 0).toLocaleString("en-IN")}`,
            icon: "⬆️",
            className: "analytics-red",
        },
        {
            title: "Total Transfers",
            value: `₹${Number(analytics.total_transfer || 0).toLocaleString("en-IN")}`,
            icon: "🔄",
            className: "analytics-purple",
        },
        {
            title: "Successful",
            value: analytics.successful_transactions ?? 0,
            icon: "✅",
            className: "analytics-success",
        },
        {
            title: "Pending",
            value: analytics.pending_transactions ?? 0,
            icon: "🟡",
            className: "analytics-warning",
        },
        {
            title: "Failed",
            value: analytics.failed_transactions ?? 0,
            icon: "❌",
            className: "analytics-danger",
        },
        {
            title: "Fraud Alerts",
            value: analytics.fraud_alerts ?? 0,
            icon: "🚨",
            className: "analytics-fraud",
        },
    ];

    return (
        <div className="row g-4">

            {cards.map((card, index) => (
                <div
                    className="col-xl-3 col-lg-4 col-md-6"
                    key={index}
                >
                    <div className={`analytics-card ${card.className}`}>

                        <div className="analytics-card-icon">
                            {card.icon}
                        </div>

                        <div>
                            <p className="analytics-card-title">
                                {card.title}
                            </p>

                            <h3 className="analytics-card-value">
                                {card.value}
                            </h3>
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
};

export default AnalyticsCards;
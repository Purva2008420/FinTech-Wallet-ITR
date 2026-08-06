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
            title: "Transactions",
            value: analytics.total_transactions,
            color: "primary",
            icon: "💳",
        },

        {
            title: "Deposits",
            value: `₹${analytics.total_deposit}`,
            color: "success",
            icon: "⬇️",
        },

        {
            title: "Withdrawals",
            value: `₹${analytics.total_withdraw}`,
            color: "warning",
            icon: "⬆️",
        },

        {
            title: "Transfers",
            value: `₹${analytics.total_transfer}`,
            color: "info",
            icon: "🔄",
        },

        {
            title: "Fraud Alerts",
            value: analytics.fraud_alerts,
            color: "danger",
            icon: "🚨",
        }

    ];

    return (

        <div className="row">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="col-lg-3 col-md-6 mb-3"
                >

                    <div className={`card border-${card.color} shadow`}>

                        <div className="card-body text-center">

                            <h2>{card.icon}</h2>

                            <h6>{card.title}</h6>

                            <h3 className={`text-${card.color}`}>
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
import React from "react";

const AdminStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="alert alert-info">
        Loading dashboard statistics...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users || 0,
      color: "primary",
      icon: "👥",
    },
    {
      title: "Total Wallets",
      value: stats.total_wallets || 0,
      color: "success",
      icon: "💳",
    },
    {
      title: "Transactions",
      value: stats.total_transactions || 0,
      color: "warning",
      icon: "💸",
    },
    {
      title: "Fraud Alerts",
      value: stats.total_fraud_alerts || 0,
      color: "danger",
      icon: "🚨",
    },
  ];

  return (
    <div className="row mb-4">
      {cards.map((card, index) => (
        <div className="col-lg-3 col-md-6 mb-3" key={index}>
          <div
            className={`card border-${card.color} shadow dashboard-card`}
          >
            <div className="card-body text-center">

              <h1>{card.icon}</h1>

              <h6 className="text-muted">
                {card.title}
              </h6>

              <h2 className={`text-${card.color}`}>
                {card.value}
              </h2>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
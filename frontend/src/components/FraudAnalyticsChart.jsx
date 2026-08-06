import React from "react";

const FraudAnalyticsChart = ({ analytics }) => {

    if (!analytics) {
        return null;
    }

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-danger text-white">

                <h5 className="mb-0">
                    Fraud Analytics
                </h5>

            </div>

            <div className="card-body">

                <div className="row text-center">

                    <div className="col-md-4">

                        <h2>
                            🚨
                        </h2>

                        <h4>
                            {analytics.fraud_alerts}
                        </h4>

                        <p>Total Alerts</p>

                    </div>

                    <div className="col-md-4">

                        <h2>
                            ✅
                        </h2>

                        <h4>
                            {analytics.successful_transactions}
                        </h4>

                        <p>Successful</p>

                    </div>

                    <div className="col-md-4">

                        <h2>
                            ❌
                        </h2>

                        <h4>
                            {analytics.failed_transactions}
                        </h4>

                        <p>Failed</p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default FraudAnalyticsChart;
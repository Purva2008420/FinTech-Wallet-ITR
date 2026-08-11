import api from "./axios";

// Dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get("accounts/admin/dashboard/");
  return response.data;
};

// Get all users
export const getUsers = async () => {
  const response = await api.get("accounts/users/");
  return response.data;
};

// Freeze a user
export const freezeUser = async (userId) => {
  const response = await api.post(
    `accounts/freeze/${userId}/`
  );

  return response.data;
};

// Unfreeze a user
export const unfreezeUser = async (userId) => {
  const response = await api.post(
    `accounts/unfreeze/${userId}/`
  );

  return response.data;
};

// Get fraud alerts
export const getFraudAlerts = async () => {
  const response = await api.get(
    "fraud-alerts/"
  );

  return response.data;
};

// Resolve fraud alert
export const resolveFraudAlert = async (alertId) => {
  const response = await api.post(
    `fraud-alerts/${alertId}/resolve/`
  );

  return response.data;
};
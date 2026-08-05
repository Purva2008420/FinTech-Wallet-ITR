import api from "./axios";

// Get transactions with optional filters
export const getTransactions = async (
  page = 1,
  type = "",
  status = ""
) => {
  let url = `transactions/?page=${page}`;

  if (type && type !== "ALL") {
    url += `&type=${type}`;
  }

  if (status && status !== "ALL") {
    url += `&status=${status}`;
  }

  const response = await api.get(url);

  return response.data;
};

// Get single transaction details
export const getTransactionById = async (id) => {
  const response = await api.get(`transactions/${id}/`);
  return response.data;
};
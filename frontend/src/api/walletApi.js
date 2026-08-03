import api from "./axios";

export const transferMoney = (data) =>
    api.post("wallet/transfer/", data);

export const getWallet = () =>
    api.get("wallet/");

import api from "./axios";

export const transferMoney = (data) =>
    api.post("wallet/transfer/", data);

export const getWallet = () =>
    api.get("wallet/");

export const withdrawMoney = (data) =>
    api.post("wallet/withdraw/", data);
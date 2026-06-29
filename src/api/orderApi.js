import api from "./axiosConfig";


export const placeOrder = async (data) => {
    const response = await api.post("/api/orders", data);
    return response.data;
};


export const getAllOrders = async () => {
    const response = await api.get("/api/orders");
    return response.data;
};


export const getPendingOrders = async () => {
    const response = await api.get("/api/orders/pending");
    return response.data;
};


export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/api/orders/${id}/status?status=${status}`);
    return response.data;
};
import api from "./axiosConfig";

export const getAllSellers = async () => {
    const response = await api.get("/api/sellers");
    return response.data;
};

export const getSellerById = async (id) => {
    const response = await api.get(`/api/sellers/${id}`);
    return response.data;
};

export const addSeller = async (data) => {
    const response = await api.post("/api/sellers", data);
    return response.data;
};

export const updateSeller = async (id, data) => {
    const response = await api.put(`/api/sellers/${id}`, data);
    return response.data;
};

export const deleteSeller = async (id) => {
    const response = await api.delete(`/api/sellers/${id}`);
    return response.data;
};
import api from "./axiosConfig";


export const getAvailableMobiles = async () => {
    const response = await api.get("/api/mobiles/available");
    return response.data;
};


export const getMobileById = async (id) => {
    const response = await api.get(`/api/mobiles/${id}`);
    return response.data;
};


export const searchMobiles = async (keyword) => {
    const response = await api.get(`/api/mobiles/search?keyword=${keyword}`);
    return response.data;
};


export const getAllMobiles = async () => {
    const response = await api.get("/api/mobiles");
    return response.data;
};


export const addMobile = async (data) => {
    const response = await api.post("/api/mobiles", data);
    return response.data;
};


export const updateMobile = async (id, data) => {
    const response = await api.put(`/api/mobiles/${id}`, data);
    return response.data;
};


export const deleteMobile = async (id) => {
    const response = await api.delete(`/api/mobiles/${id}`);
    return response.data;
};
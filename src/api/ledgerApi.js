import api from "./axiosConfig";

export const getAllEntries = async () => {
    const response = await api.get("/api/ledger");
    return response.data;
};

export const addEntry = async (data) => {
    const response = await api.post("/api/ledger", data);
    return response.data;
};

export const updateEntry = async (id, data) => {
    const response = await api.put(`/api/ledger/${id}`, data);
    return response.data;
};

export const deleteEntry = async (id) => {
    const response = await api.delete(`/api/ledger/${id}`);
    return response.data;
};
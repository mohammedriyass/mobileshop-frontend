import api from "./axiosConfig";

export const registerOwner = async (data) => {
    const response = await api.post("api/auth/register", data);
    return response.data;
}

export const loginOwner = async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
}
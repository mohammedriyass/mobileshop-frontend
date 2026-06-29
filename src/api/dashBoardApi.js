import api from "./axiosConfig";

export const getTodaySummary = async () => {
    const response = await api.get("/api/dashboard/today");
    return response.data;
};

export const getMonthSummary = async () => {
    const response = await api.get("/api/dashboard/month");
    return response.data;
};

export const getYearSummary = async () => {
    const response = await api.get("/api/dashboard/year");
    return response.data;
};
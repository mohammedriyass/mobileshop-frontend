import api from "./axiosConfig";

export const generateInvoice = async (data) => {
    const response = await api.post("/api/invoices", data);
    return response.data;
};

export const getAllInvoices = async () => {
    const response = await api.get("/api/invoices");
    return response.data;
};

export const downloadInvoicePdf = async (id) => {
    const response = await api.get(`/api/invoices/${id}/pdf`, {
        responseType: "blob", // Important for PDF download!
    });
    return response.data;
};
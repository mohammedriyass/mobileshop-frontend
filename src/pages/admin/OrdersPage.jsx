import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { generateInvoice } from "../../api/invoiceApi";

const statusTabs = ["All", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

function OrdersPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");

    // Track which order is currently updating (to show loading state per row)
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on active tab
    const filteredOrders = activeTab === "All"
        ? orders
        : orders.filter((o) => o.orderStatus === activeTab);

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders(); // refresh list
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Handle generate invoice
    const handleGenerateInvoice = async (orderId) => {
        try {
            await generateInvoice({ orderId });
            toast.success("Invoice generated! Check Invoices page.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate invoice");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PENDING": return "bg-yellow-900/30 text-yellow-400 border-yellow-800/50";
            case "CONFIRMED": return "bg-green-900/30 text-income border-green-800/50";
            case "DELIVERED": return "bg-blue-900/30 text-accessory border-blue-800/50";
            case "CANCELLED": return "bg-red-900/30 text-expense border-red-800/50";
            default: return "bg-gray-900/30 text-gray-400 border-gray-800/50";
        }
    };

    return (
        <AdminLayout>

            {/* Header */}
            <div className="mb-6">
                <h1 className="font-heading text-white text-3xl font-medium mb-1">
                    Orders
                </h1>
                <p className="text-gray-500 text-sm">
                    Manage customer orders and update delivery status
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {statusTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm border transition-all ${activeTab === tab
                                ? "bg-gold text-black border-gold font-medium"
                                : "bg-black-card text-gray-400 border-black-border hover:border-gold hover:text-gold"
                            }`}
                    >
                        {tab}
                        {tab !== "All" && (
                            <span className="ml-1.5 opacity-70">
                                ({orders.filter((o) => o.orderStatus === tab).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading && <LoadingSpinner />}

            {!loading && filteredOrders.length === 0 && (
                <EmptyState message="No orders found in this category" />
            )}

            {!loading && filteredOrders.length > 0 && (
                <div className="bg-black-card border border-black-border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-black-hover text-left">
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Phone</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Customer</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Contact</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Amount</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Payment</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Status</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-t border-black-border hover:bg-black-hover transition-colors"
                                >
                                    <td className="px-5 py-4 text-white text-sm whitespace-nowrap">
                                        {order.mobileBrand} {order.mobileModel}
                                    </td>
                                    <td className="px-5 py-4 text-white text-sm whitespace-nowrap">
                                        {order.customerName}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        {order.customerPhone}
                                    </td>
                                    <td className="px-5 py-4 text-gold text-sm font-medium whitespace-nowrap">
                                        ₹{order.totalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        {order.paymentMethod}
                                        <span className={`ml-1.5 text-xs ${order.paymentStatus === "PAID" ? "text-income" : "text-gray-600"}`}>
                                            ({order.paymentStatus})
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {/* Status Dropdown */}
                                        <select
                                            value={order.orderStatus}
                                            disabled={updatingId === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`text-xs px-2 py-1.5 rounded border bg-transparent cursor-pointer focus:outline-none ${getStatusStyle(order.orderStatus)}`}
                                        >
                                            <option value="PENDING" className="bg-black text-white">PENDING</option>
                                            <option value="CONFIRMED" className="bg-black text-white">CONFIRMED</option>
                                            <option value="DELIVERED" className="bg-black text-white">DELIVERED</option>
                                            <option value="CANCELLED" className="bg-black text-white">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleGenerateInvoice(order.id)}
                                            className="text-xs px-3 py-1.5 border border-gold text-gold rounded-lg hover:bg-gold hover:text-black transition-all whitespace-nowrap"
                                        >
                                            Generate Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </AdminLayout>
    );
}

export default OrdersPage;
import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getTodaySummary, getMonthSummary } from "../../api/dashboardApi";
import { getAllOrders } from "../../api/orderApi";
import { useAuth } from "../../context/AuthContext";

function DashboardPage() {
    const { user } = useAuth();

    const [todayData, setTodayData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data at once using Promise.all (faster!)
            const [today, month, orders] = await Promise.all([
                getTodaySummary(),
                getMonthSummary(),
                getAllOrders(),
            ]);

            setTodayData(today);
            setMonthData(month);
            setRecentOrders(orders.slice(0, 5)); // only show last 5

        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // Status badge colors for order status
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
            <div className="mb-8">
                <h1 className="font-heading text-white text-3xl font-medium mb-1">
                    Welcome back, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-500 text-sm">
                    Here's what's happening with your shop today
                </p>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && (
                <>
                    {/* ===== Stat Cards ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            label="Today's Profit"
                            value={todayData?.totalProfit}
                            color="text-income"
                        />
                        <StatCard
                            label="Month's Profit"
                            value={monthData?.totalProfit}
                            color="text-gold"
                        />
                        <StatCard
                            label="Month's Revenue"
                            value={monthData?.totalRevenue}
                            color="text-white"
                        />
                        <StatCard
                            label="Month's Expenses"
                            value={monthData?.totalExpenses}
                            color="text-expense"
                        />
                    </div>

                    {/* ===== Secondary Stats ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-black-card border border-black-border rounded-xl p-5">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                                Mobiles Sold (Month)
                            </p>
                            <p className="text-white text-2xl font-semibold">
                                {monthData?.mobileSalesCount || 0}
                            </p>
                        </div>
                        <div className="bg-black-card border border-black-border rounded-xl p-5">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                                Accessories Sold (Month)
                            </p>
                            <p className="text-white text-2xl font-semibold">
                                {monthData?.accessorySalesCount || 0}
                            </p>
                        </div>
                        <div className="bg-black-card border border-black-border rounded-xl p-5">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                                Total Orders (Month)
                            </p>
                            <p className="text-white text-2xl font-semibold">
                                {monthData?.totalOrders || 0}
                            </p>
                        </div>
                    </div>

                    {/* ===== Recent Orders Table ===== */}
                    <div className="bg-black-card border border-black-border rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-black-border">
                            <h2 className="font-heading text-white text-xl font-medium">
                                Recent Orders
                            </h2>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No orders yet</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-black-hover text-left">
                                        <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium">Customer</th>
                                        <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium">Phone</th>
                                        <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium">Amount</th>
                                        <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-t border-black-border hover:bg-black-hover transition-colors"
                                        >
                                            <td className="px-5 py-4 text-white text-sm">
                                                {order.customerName}
                                            </td>
                                            <td className="px-5 py-4 text-gray-400 text-sm">
                                                {order.customerPhone}
                                            </td>
                                            <td className="px-5 py-4 text-gold text-sm font-medium">
                                                ₹{order.totalAmount?.toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs px-2 py-1 rounded border ${getStatusStyle(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

        </AdminLayout>
    );
}

export default DashboardPage;
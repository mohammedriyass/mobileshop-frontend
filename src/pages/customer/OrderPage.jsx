import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getMobileById } from "../../api/mobileApi";
import { placeOrder } from "../../api/orderApi";

function OrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mobile data states
    const [mobile, setMobile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // Submit button loading state
    const [submitting, setSubmitting] = useState(false);

    // Fetch mobile details on page load
    useEffect(() => {
        fetchMobile();
    }, [id]);

    const fetchMobile = async () => {
        try {
            setLoading(true);
            const data = await getMobileById(id);
            setMobile(data);
        } catch (error) {
            toast.error("Failed to load phone details");
        } finally {
            setLoading(false);
        }
    };

    // Validate phone number format
    const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!customerName.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (!isValidPhone(customerPhone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        if (!customerAddress.trim()) {
            toast.error("Please enter your delivery address");
            return;
        }

        try {
            setSubmitting(true);

            const orderData = {
                mobileId: parseInt(id),
                customerName,
                customerPhone,
                customerAddress,
                paymentMethod,
            };

            const order = await placeOrder(orderData);

            if (paymentMethod === "COD") {
                toast.success("Order placed successfully!");
                navigate("/");
            } else {
                // For online payment, we'll handle Razorpay later
                toast.success("Order created! Redirecting to payment...");
                navigate("/");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black font-body">
            <Navbar />

            <div className="pt-20 pb-16">

                {loading && <LoadingSpinner />}

                {!loading && mobile && (
                    <div className="max-w-2xl mx-auto px-4">

                        <h1 className="font-heading text-white text-3xl font-medium mt-4 mb-8">
                            Complete Your Order
                        </h1>

                        {/* ===== Order Summary Card ===== */}
                        <div className="bg-black-card border border-black-border rounded-xl p-5 mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                                    {mobile.brand}
                                </p>
                                <h3 className="font-heading text-white text-xl font-medium">
                                    {mobile.model}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {mobile.storage} • {mobile.color} • {mobile.condition}
                                </p>
                            </div>
                            <p className="font-heading text-gold text-2xl font-semibold">
                                ₹{mobile.sellingPrice?.toLocaleString()}
                            </p>
                        </div>

                        {/* ===== Order Form ===== */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-black-card border border-black-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    className="w-full bg-black-card border border-black-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Delivery Address
                                </label>
                                <textarea
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    placeholder="Enter your full address"
                                    rows={3}
                                    className="w-full bg-black-card border border-black-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors resize-none"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-3">

                                    {/* COD Option */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("COD")}
                                        className={`p-4 rounded-lg border text-left transition-all ${paymentMethod === "COD"
                                                ? "border-gold bg-gold/10"
                                                : "border-black-border bg-black-card"
                                            }`}
                                    >
                                        <p className={`font-medium ${paymentMethod === "COD" ? "text-gold" : "text-white"}`}>
                                            Cash on Delivery
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Pay when you receive
                                        </p>
                                    </button>

                                    {/* Online Option */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("ONLINE")}
                                        className={`p-4 rounded-lg border text-left transition-all ${paymentMethod === "ONLINE"
                                                ? "border-gold bg-gold/10"
                                                : "border-black-border bg-black-card"
                                            }`}
                                    >
                                        <p className={`font-medium ${paymentMethod === "ONLINE" ? "text-gold" : "text-white"}`}>
                                            Online Payment
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            UPI, Card, NetBanking
                                        </p>
                                    </button>

                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gold text-black font-heading text-xl font-medium rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {submitting ? "Placing Order..." : "Confirm Order"}
                            </button>

                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderPage;
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getMobileById } from "../../api/mobileApi";

function MobileDetailPage() {

    // useParams reads the :id from URL
    // Example: /mobile/3 → id = "3"
    const { id } = useParams();

    const navigate = useNavigate();

    // States
    const [mobile, setMobile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch mobile details when page loads
    useEffect(() => {
        fetchMobile();
    }, [id]); // runs again if id changes!

    const fetchMobile = async () => {
        try {
            setLoading(true);
            const data = await getMobileById(id);
            setMobile(data);
        } catch (error) {
            console.error("Failed to fetch mobile:", error);
        } finally {
            setLoading(false);
        }
    };

    // Condition badge color
    const getConditionColor = (condition) => {
        switch (condition) {
            case "Excellent": return "text-income border-green-800 bg-green-900/20";
            case "Good": return "text-yellow-400 border-yellow-800 bg-yellow-900/20";
            case "Fair": return "text-orange-400 border-orange-800 bg-orange-900/20";
            default: return "text-gray-400 border-gray-700 bg-gray-900/20";
        }
    };

    return (
        <div className="min-h-screen bg-black font-body">
            <Navbar />

            <div className="pt-20 pb-16">

                {/* Loading */}
                {loading && <LoadingSpinner />}

                {/* Mobile not found */}
                {!loading && !mobile && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">
                            Phone not found!
                        </p>
                        <Link
                            to="/"
                            className="text-gold hover:underline"
                        >
                            ← Back to listings
                        </Link>
                    </div>
                )}

                {/* Mobile Details */}
                {!loading && mobile && (
                    <div className="max-w-5xl mx-auto px-4">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 mt-4"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to listings
                        </button>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* LEFT — Phone Image */}
                            <div className="bg-black-card border border-black-border rounded-2xl h-80 md:h-auto flex items-center justify-center">
                                {mobile.imageUrl ? (
                                    <img
                                        src={mobile.imageUrl}
                                        alt={`${mobile.brand} ${mobile.model}`}
                                        className="h-64 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <svg
                                            className="w-24 h-24 text-gray-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={0.8}
                                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-gray-600 text-sm">
                                            No Image Available
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT — Details */}
                            <div className="flex flex-col justify-between">

                                {/* Name + Price */}
                                <div>
                                    <p className="text-gray-500 text-sm tracking-widest uppercase mb-1">
                                        {mobile.brand}
                                    </p>
                                    <h1 className="font-heading text-white text-4xl font-medium mb-2">
                                        {mobile.model}
                                    </h1>
                                    <p className="font-heading text-gold text-4xl font-semibold mb-6">
                                        ₹{mobile.sellingPrice?.toLocaleString()}
                                    </p>

                                    {/* Condition Badge */}
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm border mb-6 ${getConditionColor(mobile.condition)}`}>
                                        {mobile.condition} Condition
                                    </span>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-8">

                                        <div className="bg-black-card border border-black-border rounded-xl p-3">
                                            <p className="text-gold text-xs uppercase tracking-wider mb-1">Storage</p>
                                            <p className="text-white font-medium">{mobile.storage || "N/A"}</p>
                                        </div>

                                        <div className="bg-black-card border border-black-border rounded-xl p-3">
                                            <p className="text-gold text-xs uppercase tracking-wider mb-1">RAM</p>
                                            <p className="text-white font-medium">{mobile.ram || "N/A"}</p>
                                        </div>

                                        <div className="bg-black-card border border-black-border rounded-xl p-3">
                                            <p className="text-gold text-xs uppercase tracking-wider mb-1">Color</p>
                                            <p className="text-white font-medium">{mobile.color || "N/A"}</p>
                                        </div>

                                        <div className="bg-black-card border border-black-border rounded-xl p-3">
                                            <p className="text-gold text-xs uppercase tracking-wider mb-1">Condition</p>
                                            <p className="text-white font-medium">{mobile.condition || "N/A"}</p>
                                        </div>

                                    </div>
                                </div>

                                {/* Order Button */}
                                {mobile.status === "AVAILABLE" ? (
                                    <button
                                        onClick={() => navigate(`/order/${mobile.id}`)}
                                        className="w-full py-4 bg-gold text-black font-heading text-xl font-medium rounded-xl hover:bg-gold-light transition-colors"
                                    >
                                        Order Now
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-4 bg-black-hover text-gray-600 font-heading text-xl rounded-xl cursor-not-allowed border border-black-border"
                                    >
                                        Already Sold
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default MobileDetailPage;
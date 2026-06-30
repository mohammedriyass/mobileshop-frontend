import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import MobileCard from "../../components/customer/MobileCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getAvailableMobiles, searchMobiles } from "../../api/mobileApi";

function HomePage() {
    // State for mobiles list
    const [mobiles, setMobiles] = useState([]);

    // State for loading
    const [loading, setLoading] = useState(true);

    // State for search
    const [searchQuery, setSearchQuery] = useState("");

    // State for filter
    const [selectedBrand, setSelectedBrand] = useState("All");

    const navigate = useNavigate();

    // Fetch mobiles when page loads
    useEffect(() => {
        fetchMobiles();
    }, []);

    const fetchMobiles = async () => {
        try {
            setLoading(true);
            const data = await getAvailableMobiles();
            setMobiles(data);
        } catch (error) {
            console.error("Failed to fetch mobiles:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchMobiles();
            return;
        }
        try {
            setLoading(true);
            const data = await searchMobiles(searchQuery);
            setMobiles(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique brands for filter
    const brands = ["All", ...new Set(mobiles.map((m) => m.brand))];

    // Filter by selected brand
    const filteredMobiles = selectedBrand === "All"
        ? mobiles
        : mobiles.filter((m) => m.brand === selectedBrand);

    return (
        <div className="min-h-screen bg-black font-body">

            {/* Navbar */}
            <Navbar />

            {/* Main content - padding top for fixed navbar */}
            <div className="pt-20">

                {/* ===== HERO SECTION ===== */}
                <section className="px-4 py-16 max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 text-sm tracking-widest mb-3 uppercase">
                        Tiruppur's Finest
                    </p>
                    <h1 className="font-heading text-white text-5xl md:text-6xl font-medium mb-4 leading-tight">
                        Premium Second-Hand
                        <span className="text-gold"> Phones</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-10">
                        Quality verified. Priced right. Delivered fast.
                    </p>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex max-w-xl mx-auto gap-2"
                    >
                        <div className="flex-1 flex items-center bg-black-card border border-black-border rounded-lg overflow-hidden focus-within:border-gold transition-colors">
                            <svg
                                className="w-4 h-4 text-gray-500 ml-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search iPhone, Samsung, OnePlus..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white text-sm py-3 px-3 placeholder-gray-600 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gold text-black text-sm font-medium rounded-lg hover:bg-gold-light transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </section>

                {/* ===== BRAND FILTER ===== */}
                <section className="px-4 max-w-7xl mx-auto mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(brand)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all ${selectedBrand === brand
                                    ? "bg-gold text-black border-gold font-medium"
                                    : "bg-transparent text-gray-400 border-black-border hover:border-gold hover:text-gold"
                                    }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ===== MOBILE LISTINGS ===== */}
                <section className="px-4 max-w-7xl mx-auto mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-white text-3xl font-medium">
                            Available Phones
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {filteredMobiles.length} phones found
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && <LoadingSpinner />}

                    {/* No results */}
                    {!loading && filteredMobiles.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                No phones found
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedBrand("All");
                                    fetchMobiles();
                                }}
                                className="mt-4 text-gold text-sm hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Horizontal Slider */}
                    {!loading && filteredMobiles.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                            {filteredMobiles.map((mobile) => (
                                <div key={mobile.id} className="snap-start">
                                    <MobileCard mobile={mobile} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="border-t border-black-border px-4 py-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <h2 className="font-heading text-gold text-2xl font-medium tracking-widest">
                            Royal Mobiles
                        </h2>
                        <p className="text-gray-600 text-sm">
                            © 2026 Royal  Mobiles. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-sm">
                            Tiruppur, Tamil Nadu
                        </p>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default HomePage;
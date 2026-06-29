import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    // State for search input value
    const [searchQuery, setSearchQuery] = useState("");

    // useNavigate lets us go to another page programmatically
    const navigate = useNavigate();

    // When user types and presses Enter or clicks search
    const handleSearch = (e) => {
        e.preventDefault(); // prevent page reload
        if (searchQuery.trim()) {
            // Go to home page with search query
            navigate(`/?search=${searchQuery}`);
        }
    };

    return (
        // Fixed navbar — stays at top even when scrolling
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-black-border">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">

                {/* ===== LEFT — Logo ===== */}
                <Link to="/" className="flex-shrink-0">
                    <h1 className="font-heading text-gold text-2xl font-medium tracking-widest hover:text-gold-light transition-colors">
                        MobileZone
                    </h1>
                </Link>

                {/* ===== MIDDLE — Search Bar ===== */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 flex items-center gap-2"
                >
                    <div className="flex-1 flex items-center bg-black-card border border-black-border rounded-lg overflow-hidden focus-within:border-gold transition-colors">
                        {/* Search icon */}
                        <div className="px-3 py-2.5">
                            <svg
                                className="w-4 h-4 text-gray-500"
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
                        </div>

                        {/* Search input */}
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm py-2.5 pr-3 placeholder-gray-600 focus:outline-none"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-gold text-black text-sm font-medium rounded-lg hover:bg-gold-light transition-colors flex-shrink-0"
                    >
                        Search
                    </button>
                </form>

                {/* ===== RIGHT — Admin Button ===== */}
                <Link
                    to="/admin/login"
                    className="flex-shrink-0 px-4 py-2 border border-gold text-gold text-sm font-medium rounded-lg hover:bg-gold hover:text-black transition-all"
                >
                    Admin
                </Link>

            </div>
        </nav>
    );
}

export default Navbar;
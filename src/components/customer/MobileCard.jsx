import { Link } from "react-router-dom";

// condition badge color
function ConditionBadge({ condition }) {
    const colors = {
        Excellent: "text-income border-green-800 bg-green-900/20",
        Good: "text-yellow-400 border-yellow-800 bg-yellow-900/20",
        Fair: "text-orange-400 border-orange-800 bg-orange-900/20",
    };

    return (
        <span className={`text-xs px-2 py-0.5 rounded border ${colors[condition] || "text-gray-400 border-gray-700"}`}>
            {condition}
        </span>
    );
}

function MobileCard({ mobile }) {
    return (
        // Each card is a fixed width slide
        <div className="flex-shrink-0 w-64 bg-black-card border border-black-border rounded-xl overflow-hidden hover:border-gold transition-all duration-300 group">

            {/* Phone Image Area */}
            <div className="bg-black-hover h-48 flex items-center justify-center border-b border-black-border relative">

                {/* If image exists show it, else show icon */}
                {mobile.imageUrl ? (
                    <img
                        src={mobile.imageUrl}
                        alt={`${mobile.brand} ${mobile.model}`}
                        className="h-40 w-auto object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="w-16 h-16 text-gray-700 group-hover:text-gold transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-gray-700 text-xs">No Image</span>
                    </div>
                )}

                {/* Status badge top right */}
                <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${mobile.status === "AVAILABLE"
                            ? "bg-green-900/40 text-income border border-green-800/50"
                            : "bg-red-900/40 text-expense border border-red-800/50"
                        }`}>
                        {mobile.status}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">

                {/* Brand + Model */}
                <h3 className="font-heading text-white text-xl font-medium leading-tight mb-1">
                    {mobile.brand} {mobile.model}
                </h3>

                {/* Specs chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {mobile.storage && (
                        <span className="text-xs px-2 py-0.5 bg-black-hover border border-black-border rounded text-gray-400">
                            {mobile.storage}
                        </span>
                    )}
                    {mobile.ram && (
                        <span className="text-xs px-2 py-0.5 bg-black-hover border border-black-border rounded text-gray-400">
                            {mobile.ram} RAM
                        </span>
                    )}
                    {mobile.color && (
                        <span className="text-xs px-2 py-0.5 bg-black-hover border border-black-border rounded text-gray-400">
                            {mobile.color}
                        </span>
                    )}
                    {mobile.condition && (
                        <ConditionBadge condition={mobile.condition} />
                    )}
                </div>

                {/* Price + Button Row */}
                <div className="flex items-center justify-between">
                    <p className="font-heading text-gold text-2xl font-semibold">
                        ₹{mobile.sellingPrice?.toLocaleString()}
                    </p>
                    <Link
                        to={`/mobile/${mobile.id}`}
                        className="px-3 py-1.5 border border-gold text-gold text-xs rounded-lg hover:bg-gold hover:text-black transition-all"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MobileCard;
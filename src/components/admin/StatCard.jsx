function StatCard({ label, value, color = "text-white" }) {
    return (
        <div className="bg-black-card border border-black-border rounded-xl p-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                {label}
            </p>
            <p className={`font-heading text-3xl font-semibold ${color}`}>
                ₹{value?.toLocaleString() || 0}
            </p>
        </div>
    );
}

export default StatCard;
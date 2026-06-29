// Shows colored status pills like AVAILABLE, SOLD, PENDING etc.

function StatusBadge({ status }) {

    const getStyles = () => {
        switch (status) {
            case "AVAILABLE":
                return "bg-green-900/30 text-income border border-green-800/50";
            case "SOLD":
                return "bg-red-900/30 text-expense border border-red-800/50";
            case "PENDING":
                return "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50";
            case "CONFIRMED":
                return "bg-green-900/30 text-income border border-green-800/50";
            case "DELIVERED":
                return "bg-blue-900/30 text-accessory border border-blue-800/50";
            case "CANCELLED":
                return "bg-red-900/30 text-expense border border-red-800/50";
            case "PAID":
                return "bg-green-900/30 text-income border border-green-800/50";
            default:
                return "bg-gray-900/30 text-gray-400 border border-gray-800/50";
        }
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStyles()}`}>
            {status}
        </span>
    );
}

export default StatusBadge;
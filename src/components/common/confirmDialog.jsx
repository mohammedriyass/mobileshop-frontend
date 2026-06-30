function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black-card border border-black-border rounded-2xl w-full max-w-sm p-6">

                <h3 className="font-heading text-white text-xl font-medium mb-2">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-black-border text-gray-400 rounded-lg hover:bg-black-hover transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-expense text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ConfirmDialog;
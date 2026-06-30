function Modal({ isOpen, onClose, title, children }) {

    // If not open, render nothing!
    if (!isOpen) return null;

    return (
        // Dark overlay covering full screen
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">

            {/* Modal Card */}
            <div className="bg-black-card border border-black-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-black-border sticky top-0 bg-black-card">
                    <h3 className="font-heading text-white text-xl font-medium">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gold transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - whatever is passed as children */}
                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default Modal;
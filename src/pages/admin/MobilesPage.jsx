import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getAllMobiles, addMobile, updateMobile, deleteMobile } from "../../api/mobileApi";
import { getAllSellers } from "../../api/sellerApi";

// Empty form template
const emptyForm = {
    brand: "", model: "", color: "", storage: "", ram: "",
    condition: "Good", buyingPrice: "", sellingPrice: "",
    imeiNumber1: "", imeiNumber2: "", description: "", sellerId: "",
};

function MobilesPage() {

    const [mobiles, setMobiles] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = adding new, else = editing
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation states
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [mobilesData, sellersData] = await Promise.all([
                getAllMobiles(),
                getAllSellers(),
            ]);
            setMobiles(mobilesData);
            setSellers(sellersData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // Open modal for adding new mobile
    const handleAddClick = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setIsModalOpen(true);
    };

    // Open modal for editing existing mobile
    const handleEditClick = (mobile) => {
        setEditingId(mobile.id);
        setFormData({
            brand: mobile.brand,
            model: mobile.model,
            color: mobile.color || "",
            storage: mobile.storage || "",
            ram: mobile.ram || "",
            condition: mobile.condition,
            buyingPrice: mobile.buyingPrice,
            sellingPrice: mobile.sellingPrice,
            imeiNumber1: mobile.imeiNumber1,
            imeiNumber2: mobile.imeiNumber2 || "",
            description: mobile.description || "",
            sellerId: mobile.sellerId,
        });
        setIsModalOpen(true);
    };

    // Update form field
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Submit form (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.brand || !formData.model || !formData.imeiNumber1 || !formData.sellerId) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setSubmitting(true);

            // Convert price strings to numbers
            const payload = {
                ...formData,
                buyingPrice: parseFloat(formData.buyingPrice),
                sellingPrice: parseFloat(formData.sellingPrice),
                sellerId: parseInt(formData.sellerId),
            };

            if (editingId) {
                // Update existing
                await updateMobile(editingId, payload);
                toast.success("Mobile updated successfully!");
            } else {
                // Add new
                await addMobile(payload);
                toast.success("Mobile added successfully!");
            }

            setIsModalOpen(false);
            fetchData(); // refresh list

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDeleteConfirm = async () => {
        try {
            await deleteMobile(deleteId);
            toast.success("Mobile deleted!");
            setDeleteId(null);
            fetchData();
        } catch (error) {
            toast.error("Failed to delete mobile");
        }
    };

    return (
        <AdminLayout>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-white text-3xl font-medium mb-1">
                        Mobiles
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your phone listings
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="px-5 py-2.5 bg-gold text-black text-sm font-medium rounded-lg hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Mobile
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && mobiles.length === 0 && (
                <EmptyState message="No mobiles added yet. Click 'Add Mobile' to get started!" />
            )}

            {/* Table */}
            {!loading && mobiles.length > 0 && (
                <div className="bg-black-card border border-black-border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-black-hover text-left">
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Phone</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Specs</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Buying</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Selling</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Profit</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Status</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mobiles.map((mobile) => (
                                <tr
                                    key={mobile.id}
                                    className="border-t border-black-border hover:bg-black-hover transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <p className="text-white text-sm font-medium">{mobile.brand} {mobile.model}</p>
                                        <p className="text-gray-600 text-xs">IMEI: {mobile.imeiNumber1}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        {mobile.storage} • {mobile.ram} • {mobile.color}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        ₹{mobile.buyingPrice?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-white text-sm whitespace-nowrap">
                                        ₹{mobile.sellingPrice?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-income text-sm font-medium whitespace-nowrap">
                                        ₹{mobile.profit?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2 py-1 rounded border whitespace-nowrap ${mobile.status === "AVAILABLE"
                                            ? "bg-green-900/30 text-income border-green-800/50"
                                            : "bg-red-900/30 text-expense border-red-800/50"
                                            }`}>
                                            {mobile.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditClick(mobile)}
                                                className="text-accessory hover:text-blue-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(mobile.id)}
                                                className="text-expense hover:text-red-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== Add/Edit Modal ===== */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Mobile" : "Add New Mobile"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Brand *</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => handleChange("brand", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Model *</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => handleChange("model", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Storage</label>
                            <input
                                type="text"
                                placeholder="128GB"
                                value={formData.storage}
                                onChange={(e) => handleChange("storage", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">RAM</label>
                            <input
                                type="text"
                                placeholder="6GB"
                                value={formData.ram}
                                onChange={(e) => handleChange("ram", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Color</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => handleChange("color", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Condition</label>
                        <select
                            value={formData.condition}
                            onChange={(e) => handleChange("condition", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                        >
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Buying Price *</label>
                            <input
                                type="number"
                                value={formData.buyingPrice}
                                onChange={(e) => handleChange("buyingPrice", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Selling Price *</label>
                            <input
                                type="number"
                                value={formData.sellingPrice}
                                onChange={(e) => handleChange("sellingPrice", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">IMEI Number 1 *</label>
                            <input
                                type="text"
                                maxLength={15}
                                value={formData.imeiNumber1}
                                onChange={(e) => handleChange("imeiNumber1", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">IMEI Number 2</label>
                            <input
                                type="text"
                                maxLength={15}
                                value={formData.imeiNumber2}
                                onChange={(e) => handleChange("imeiNumber2", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Seller *</label>
                        <select
                            value={formData.sellerId}
                            onChange={(e) => handleChange("sellerId", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                        >
                            <option value="">Select seller</option>
                            {sellers.map((seller) => (
                                <option key={seller.id} value={seller.id}>
                                    {seller.name} - {seller.phone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Description</label>
                        <textarea
                            rows={2}
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-gold text-black font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 mt-2"
                    >
                        {submitting ? "Saving..." : editingId ? "Update Mobile" : "Add Mobile"}
                    </button>

                </form>
            </Modal>

            {/* ===== Delete Confirmation ===== */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Mobile?"
                message="This action cannot be undone. The mobile listing will be permanently removed."
            />

        </AdminLayout>
    );
}

export default MobilesPage;
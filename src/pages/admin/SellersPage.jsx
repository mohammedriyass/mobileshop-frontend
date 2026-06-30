import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getAllSellers, addSeller, updateSeller, deleteSeller } from "../../api/sellerApi";

const emptyForm = {
    name: "", phone: "", address: "", idProof: "", idProofType: "AADHAR",
};

function SellersPage() {

    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const data = await getAllSellers();
            setSellers(data);
        } catch (error) {
            toast.error("Failed to load sellers");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setIsModalOpen(true);
    };

    const handleEditClick = (seller) => {
        setEditingId(seller.id);
        setFormData({
            name: seller.name,
            phone: seller.phone,
            address: seller.address || "",
            idProof: seller.idProof || "",
            idProofType: seller.idProofType || "AADHAR",
        });
        setIsModalOpen(true);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim()) {
            toast.error("Name and phone are required");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error("Phone must be 10 digits");
            return;
        }

        try {
            setSubmitting(true);

            if (editingId) {
                await updateSeller(editingId, formData);
                toast.success("Seller updated successfully!");
            } else {
                await addSeller(formData);
                toast.success("Seller added successfully!");
            }

            setIsModalOpen(false);
            fetchSellers();

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteSeller(deleteId);
            toast.success("Seller deleted!");
            setDeleteId(null);
            fetchSellers();
        } catch (error) {
            toast.error("Failed to delete seller. They may have mobiles linked to them.");
        }
    };

    return (
        <AdminLayout>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-white text-3xl font-medium mb-1">
                        Sellers
                    </h1>
                    <p className="text-gray-500 text-sm">
                        People who sold phones to your shop
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="px-5 py-2.5 bg-gold text-black text-sm font-medium rounded-lg hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Seller
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && sellers.length === 0 && (
                <EmptyState message="No sellers added yet. Click 'Add Seller' to get started!" />
            )}

            {!loading && sellers.length > 0 && (
                <div className="bg-black-card border border-black-border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-black-hover text-left">
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Name</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Phone</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Address</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">ID Proof</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Phones Sold</th>
                                <th className="px-5 py-3 text-gray-500 text-xs uppercase font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((seller) => (
                                <tr
                                    key={seller.id}
                                    className="border-t border-black-border hover:bg-black-hover transition-colors"
                                >
                                    <td className="px-5 py-4 text-white text-sm font-medium whitespace-nowrap">
                                        {seller.name}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        {seller.phone}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm max-w-xs truncate">
                                        {seller.address || "—"}
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                                        {seller.idProofType}
                                    </td>
                                    <td className="px-5 py-4 text-gold text-sm font-medium whitespace-nowrap">
                                        {seller.totalPhonesSold || 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditClick(seller)}
                                                className="text-accessory hover:text-blue-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(seller.id)}
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
                title={editingId ? "Edit Seller" : "Add New Seller"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Phone Number *</label>
                        <input
                            type="tel"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1.5">Address</label>
                        <textarea
                            rows={2}
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">ID Proof Type</label>
                            <select
                                value={formData.idProofType}
                                onChange={(e) => handleChange("idProofType", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            >
                                <option value="AADHAR">Aadhar</option>
                                <option value="PAN">PAN</option>
                                <option value="VOTER_ID">Voter ID</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">ID Number</label>
                            <input
                                type="text"
                                value={formData.idProof}
                                onChange={(e) => handleChange("idProof", e.target.value)}
                                className="w-full bg-black border border-black-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-gold text-black font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 mt-2"
                    >
                        {submitting ? "Saving..." : editingId ? "Update Seller" : "Add Seller"}
                    </button>

                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Seller?"
                message="This action cannot be undone."
            />

        </AdminLayout>
    );
}

export default SellersPage;
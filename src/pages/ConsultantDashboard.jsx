import { Navigate, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    createTourpackage,
    deleteTourpackage,
    getMyTourpackages,
    getTourpackageBookings,
    updateBookingStatus,
    updateTourpackage,
} from "../services/tourpackageService";
import { toast } from "react-toastify";

const ConsultantDashboard = () => {
    const data = useLoaderData();
    const user = data.user;

    const [tourPackages, setTourPackages] = useState([]);
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [showBookings, setShowBookings] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "Domestic",
        price: "",
        duration: "",
        
    });

    if (user.role !== "consultant") {
        toast.error("Access denied!");

        if (user.role === "admin") {
            return <Navigate to="/admin-dashboard" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    useEffect(() => {
        fetchTourPackages();
    }, []);

    const fetchTourPackages = async () => {
        try {
            setLoading(true);
            const response = await getMyTourpackages();
            setTourPackages(response.tourpackages || []);
        } catch (error) {
            toast.error("Failed to fetch tour packages");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            location: "",
            category: "Domestic",
            price: "",
            duration: "",
            
        });
        setEditingPackage(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
            };

            if (editingPackage) {
                await updateTourpackage(editingPackage._id, payload);
                toast.success("Updated successfully");
            } else {
                await createTourpackage(payload);
                toast.success("Created successfully");
            }

            resetForm();
            fetchTourPackages();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData(pkg);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await deleteTourpackage(id);
            toast.success("Deleted successfully");
            fetchTourPackages();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleViewBookings = async (packageId) => {
        try {
            const response = await getTourpackageBookings(packageId);
            setSelectedBookings(response.bookings || []);
            setShowBookings(true);
        } catch {
            toast.error("Failed to fetch bookings");
        }
    };

    // ✅ CLEAN STATUS UPDATE
    const handleBookingStatus = async (bookingId, status) => {
        try {
            await updateBookingStatus(bookingId, status);

            toast.success("Status updated");

            setSelectedBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId
                        ? { ...b, bookingStatus: status }
                        : b
                )
            );
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-3xl font-bold">
                        Consultant Dashboard
                    </h1>

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add Package
                    </button>
                </div>


{showForm && (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">
            {editingPackage ? "Edit Package" : "Add New Package"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
                type="text"
                name="title"
                placeholder="Package Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border p-3 rounded"
            />

            <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="border p-3 rounded"
            />

            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-3 rounded"
            >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
            </select>

            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="border p-3 rounded"
            />

            <input
                type="text"
                name="duration"
                placeholder="Duration (e.g. 5 Days)"
                value={formData.duration}
                onChange={handleChange}
                required
                className="border p-3 rounded"
            />

          

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="border p-3 rounded md:col-span-2"
            />

            <div className="md:col-span-2 flex gap-4">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded"
                >
                    {editingPackage ? "Update" : "Create"}
                </button>

                <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
)}


                {/* PACKAGES */}
                <div className="grid md:grid-cols-3 gap-6">
                    {tourPackages.map((pkg) => (
                        <div key={pkg._id} className="bg-white p-5 rounded shadow">

                            <h2 className="text-xl font-bold">{pkg.title}</h2>
                            <p>{pkg.location}</p>

                            <p className="text-green-600 font-bold mt-2">
                                ₹{pkg.price}
                            </p>

                            <p className="text-sm">
                                Bookings: {pkg.bookingCount}
                            </p>

                            <div className="flex gap-2 mt-3">
                                <button onClick={() => handleEdit(pkg)} className="bg-yellow-500 px-2 text-white rounded">
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(pkg._id)} className="bg-red-500 px-2 text-white rounded">
                                    Delete
                                </button>

                                <button onClick={() => handleViewBookings(pkg._id)} className="bg-blue-500 px-2 text-white rounded">
                                    Bookings
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOOKINGS */}
                {showBookings && (
                    <div className="mt-10 bg-white p-6 rounded shadow">

                        <h2 className="text-2xl font-bold mb-4">
                            Package Bookings
                        </h2>

                        {selectedBookings.map((b) => (
                            <div key={b._id} className="border p-4 mb-3 rounded">

                                <p><b>{b.customer?.name}</b></p>
                                <p>{b.customer?.email}</p>
                                <p>People: {b.numberOfPeople}</p>

                                <p className="mt-1">
                                    Status: <b>{b.bookingStatus}</b>
                                </p>

                                {/* CLEAN STATUS FLOW */}
                                <div className="flex gap-3 mt-3 flex-wrap">

                                    {b.bookingStatus === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleBookingStatus(b._id, "Confirmed")}
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Confirm
                                            </button>

                                            <button
                                                onClick={() => handleBookingStatus(b._id, "Cancelled")}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {b.bookingStatus === "Confirmed" && (
                                        <>
                                            <button
                                                onClick={() => handleBookingStatus(b._id, "Completed")}
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                Complete
                                            </button>

                                            <button
                                                onClick={() => handleBookingStatus(b._id, "Cancelled")}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {b.bookingStatus === "Completed" && (
                                        <span className="text-green-600 font-bold">
                                            Completed
                                        </span>
                                    )}

                                    {b.bookingStatus === "Cancelled" && (
                                        <span className="text-red-600 font-bold">
                                            Cancelled
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultantDashboard;
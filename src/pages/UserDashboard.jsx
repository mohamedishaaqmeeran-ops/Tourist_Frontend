import { Navigate, useLoaderData, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyBookings } from "../services/tourpackageService";

const UserDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ❌ access control
    if (user.role !== "user") {
        toast.error("Access denied. Users only.");

        if (user.role === "admin") {
            return <Navigate to="/admin-dashboard" replace />;
        }

        if (user.role === "consultant") {
            return <Navigate to="/consultant-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getMyBookings();
            setBookings(response.bookings || []);
        } catch (error) {
            toast.error("Failed to fetch your bookings.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED STATUS COLOR (case-safe)
    const getStatusColor = (status) => {
        const normalized = status?.toLowerCase();

        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };

        return colors[normalized] || "bg-gray-100 text-gray-800";
    };

    // ✅ FIXED STATS (uses bookingStatus correctly)
    const stats = {
        total: bookings.length,

        pending: bookings.filter(
            (b) => b.bookingStatus?.toLowerCase() === "pending"
        ).length,

        confirmed: bookings.filter(
            (b) => b.bookingStatus?.toLowerCase() === "confirmed"
        ).length,

        completed: bookings.filter(
            (b) => b.bookingStatus?.toLowerCase() === "completed"
        ).length,

        cancelled: bookings.filter(
            (b) => b.bookingStatus?.toLowerCase() === "cancelled"
        ).length,

        totalSpent: bookings
            .filter(
                (b) => b.bookingStatus?.toLowerCase() !== "cancelled"
            )
            .reduce(
                (sum, booking) => sum + (booking.totalAmount || 0),
                0
            ),
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your tour bookings and travel plans.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                    <StatCard title="Total" value={stats.total} color="text-indigo-600" />
                    <StatCard title="Pending" value={stats.pending} color="text-yellow-600" />
                    <StatCard title="Confirmed" value={stats.confirmed} color="text-blue-600" />
                    <StatCard title="Completed" value={stats.completed} color="text-green-600" />
                    <StatCard title="Cancelled" value={stats.cancelled} color="text-red-600" />
                    <StatCard
                        title="Total Spent"
                        value={`₹${stats.totalSpent.toLocaleString()}`}
                        color="text-emerald-600"
                    />
                </div>

                {/* QUICK ACTIONS */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate("/tourpackages")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Browse Tour Packages
                        </button>
                    </div>
                </div>

                {/* BOOKINGS */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-semibold">
                            My Bookings
                        </h2>
                    </div>

                    {/* LOADING */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                                No bookings found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Start exploring amazing destinations today.
                            </p>
                            <button
                                onClick={() => navigate("/tourpackages")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                            >
                                Explore Packages
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">

                                {/* TABLE HEADER */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Package</th>
                                        <th className="px-6 py-4 text-left">Travel Date</th>
                                        <th className="px-6 py-4 text-left">Travelers</th>
                                        <th className="px-6 py-4 text-left">Price / Person</th>
                                        <th className="px-6 py-4 text-left">Total Amount</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-left">Actions</th>
                                    </tr>
                                </thead>

                                {/* TABLE BODY */}
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="border-t hover:bg-gray-50">

                                            {/* PACKAGE */}
                                            <td className="px-6 py-4">
                                                <h4 className="font-semibold text-gray-800">
                                                    {booking.tourpackage?.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {booking.tourpackage?.location}
                                                </p>
                                            </td>

                                            {/* DATE */}
                                            <td className="px-6 py-4">
                                                {new Date(booking.travelDate).toLocaleDateString()}
                                            </td>

                                            {/* PEOPLE */}
                                            <td className="px-6 py-4">
                                                {booking.numberOfPeople}
                                            </td>

                                            {/* PRICE */}
                                            <td className="px-6 py-4 text-blue-600 font-medium">
                                                ₹{booking.tourpackage?.price?.toLocaleString()}
                                            </td>

                                            {/* TOTAL */}
                                            <td className="px-6 py-4 font-bold text-green-600">
                                                ₹{booking.totalAmount?.toLocaleString()}
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => navigate(`/bookings/${booking._id}`)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* STAT CARD */
const StatCard = ({ title, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-500 text-sm font-medium">
            {title}
        </h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
            {value}
        </p>
    </div>
);

export default UserDashboard;
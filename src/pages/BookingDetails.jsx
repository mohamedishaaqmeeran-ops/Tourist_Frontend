import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { getBookingById } from "../services/tourpackageService";

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const response = await getBookingById(bookingId);
            setBooking(response.booking);
        } catch (error) {
            toast.error("Failed to load booking details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-800",
            Confirmed: "bg-blue-100 text-blue-800",
            Completed: "bg-green-100 text-green-800",
            Cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold">Booking not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Booking Details
                    </h1>

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Back
                    </button>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white rounded-xl shadow p-6">

                    {/* PACKAGE INFO */}
                    <h2 className="text-2xl font-bold">
                        {booking.tourpackage?.title}
                    </h2>

                    <p className="text-gray-600 mt-1">
                        {booking.tourpackage?.location}
                    </p>

                    <p className="text-green-600 font-bold text-xl mt-2">
                        ₹{booking.tourpackage?.price}
                    </p>

                    {/* CUSTOMER INFO */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">
                            Customer Info
                        </h3>

                        <p>Name: {booking.customer?.name}</p>
                        <p>Email: {booking.customer?.email}</p>
                    </div>

                    {/* BOOKING INFO */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">
                            Booking Info
                        </h3>

                        <p>Travelers: {booking.numberOfPeople}</p>

                        <p>
                            Travel Date:{" "}
                            {new Date(booking.travelDate).toLocaleDateString()}
                        </p>

                        <p className="mt-2">
                            Total Amount:{" "}
                            <span className="font-bold text-green-600">
                                ₹{booking.totalAmount}
                            </span>
                        </p>

                        <p className="mt-2">
                            Status:{" "}
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                    booking.bookingStatus
                                )}`}
                            >
                                {booking.bookingStatus}
                            </span>
                        </p>
                    </div>

                    {/* TIMESTAMP */}
                    <div className="mt-6 border-t pt-4 text-sm text-gray-500">
                        <p>
                            Booked At:{" "}
                            {new Date(booking.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
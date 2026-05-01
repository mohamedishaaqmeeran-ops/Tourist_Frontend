import { useEffect,  useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
    getTourpackageById,
    bookingForTourpackage
} from "../services/tourpackageService";

const TourPackageDetails = () => {
    // FIXED: route param name must match App.jsx
    const { tourpackageId } = useParams();

    const navigate = useNavigate();
    const userData = useLoaderData();

    const [user] = useState(userData?.user || null);
    const [tourPackage, setTourPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);

    const [bookingData, setBookingData] = useState({
        numberOfPeople: 1,
        travelDate: "",
    });

    useEffect(() => {
        if (tourpackageId) {
            fetchTourPackage();
        }
    }, [tourpackageId]);

    const fetchTourPackage = async () => {
        try {
            setLoading(true);
            const response = await getTourpackageById(tourpackageId);

            // Handle both response formats
            setTourPackage(
                response.tourPackage ||
                response.tourpackage ||
                response.data?.tourPackage ||
                response.data?.tourpackage
            );
        } catch (error) {
            toast.error("Failed to fetch tour package details");
            navigate("/tourpackages");
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            toast.info("Please login to book this package");
            navigate("/login");
            return;
        }

        if (user.role !== "user") {
            toast.error("Only users can book tour packages");
            return;
        }

        setShowBookingForm(true);
    };

   const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
        setBooking(true);

        const response = await bookingForTourpackage(
            tourpackageId,
            bookingData
        );

        if (response) {
            toast.success("Tour package booked successfully!");

            setShowBookingForm(false);
            setBookingData({
                numberOfPeople: 1,
                travelDate: "",
            });

            // ✅ navigate AFTER success
            navigate("/dashboard");
        }
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to book tour package"
        );
    } finally {
        setBooking(false);
    }
};

    const calculateTotal = () => {
        if (!tourPackage) return 0;

        return (
            Number(tourPackage.price) *
            Number(bookingData.numberOfPeople)
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center py-24">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!tourPackage) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="text-center py-20">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tour Package Not Found
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <img
                                src={
                                    tourPackage.image ||
                                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                                }
                                alt={tourPackage.title}
                                className="w-full h-96 object-cover"
                            />

                            <div className="p-8">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    {tourPackage.title}
                                </h1>

                                <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                                    <span>📍 {tourPackage.location}</span>
                                    <span>🕒 {tourPackage.duration}</span>
                                    <span>
                                        🏢 {tourPackage.consultancy?.name}
                                    </span>
                                </div>

                                <div className="text-4xl font-bold text-green-600 mb-8">
                                    ₹{tourPackage.price?.toLocaleString()}
                                    <span className="text-lg text-gray-500 font-normal ml-2">
                                        per person
                                    </span>
                                </div>

                                <section className="mb-8">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        Description
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {tourPackage.description}
                                    </p>
                                </section>

                                {tourPackage.consultancy && (
                                    <section>
                                        <h2 className="text-2xl font-semibold mb-4">
                                            About Consultancy
                                        </h2>
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h3 className="text-xl font-bold mb-2">
                                                {tourPackage.consultancy.name}
                                            </h3>

                                            <p className="text-gray-700 mb-2">
                                                {tourPackage.consultancy.description}
                                            </p>

                                            <p className="text-gray-600">
                                                📍 {tourPackage.consultancy.location}
                                            </p>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-2xl font-bold mb-6">
                                Booking Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <SummaryItem
                                    label="Category"
                                    value={tourPackage.category}
                                />
                                <SummaryItem
                                    label="Location"
                                    value={tourPackage.location}
                                />
                                <SummaryItem
                                    label="Duration"
                                    value={tourPackage.duration}
                                />
                                <SummaryItem
                                    label="Price"
                                    value={`₹${tourPackage.price?.toLocaleString()}`}
                                />
                                <SummaryItem
                                    label="Booked"
                                    value={tourPackage.bookingCount || 0}
                                />
                            </div>

                            {!showBookingForm ? (
                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
                                >
                                    Book Now
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleBookingSubmit}
                                    className="space-y-4"
                                >
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={bookingData.numberOfPeople}
                                        onChange={(e) =>
                                            setBookingData({
                                                ...bookingData,
                                                numberOfPeople: Number(e.target.value),
                                            })
                                        }
                                        className="w-full border rounded-lg p-3"
                                    />

                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        value={bookingData.travelDate}
                                        onChange={(e) =>
                                            setBookingData({
                                                ...bookingData,
                                                travelDate: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded-lg p-3"
                                    />

                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <p>Total Amount</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            ₹{calculateTotal().toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={booking}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl"
                                    >
                                        {booking
                                            ? "Processing..."
                                            : "Confirm Booking"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowBookingForm(false)
                                        }
                                        className="w-full bg-gray-200 py-3 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    );
                                    toast.success("Link copied!");
                                }}
                                className="w-full mt-4 border py-3 rounded-xl"
                            >
                                Share Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryItem = ({ label, value }) => (
    <div className="flex justify-between border-b pb-3">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

export default TourPackageDetails;
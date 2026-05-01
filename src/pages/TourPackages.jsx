import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import instance from "../instances/instance";

const TourPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTourPackages();
    }, []);

    const fetchTourPackages = async () => {
        try {
            setLoading(true);
            const response = await instance.get("/tourpackages");
            setPackages(response.data.tourpackages || []);
        } catch (error) {
            toast.error("Failed to load tour packages");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Explore Tour Packages
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Discover amazing destinations around the world
                    </p>
                </div>

                {packages.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            No Tour Packages Available
                        </h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((tour) => (
                            <div
                                key={tour._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                            >
                                <img
                                    src={
                                        tour.image ||
                                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                                    }
                                    alt={tour.title}
                                    className="w-full h-56 object-cover"
                                />

                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                            {tour.category}
                                        </span>
                                        <span className="text-green-600 font-bold text-xl">
                                            ${tour.price}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {tour.title}
                                    </h2>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {tour.description}
                                    </p>

                                    <div className="space-y-2 mb-5 text-gray-700">
                                        <p>📍 {tour.location}</p>
                                        <p>⏳ {tour.duration}</p>
                                    </div>

                                    <Link
    to={`/tourpackage/${tour._id}`}
    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
>
    View Details
</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourPackages;
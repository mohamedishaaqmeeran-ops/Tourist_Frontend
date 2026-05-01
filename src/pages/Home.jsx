import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllTourpackages } from "../services/tourpackageService";
import { toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();

    const [tourPackages, setTourPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        search: "",
        location: "",
        category: "",
        duration: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTourPackages();
    }, [currentPage]);

    const fetchTourPackages = async (filters = searchParams) => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
                limit: 12,
                ...filters
            };

            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

           const response = await getAllTourpackages(params);

            setTourPackages(response.tourpackages || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            toast.error("Failed to fetch tour packages");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTourPackages();
    };

    const handlePackageClick = (id) => {
        navigate(`/tourpackage/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Discover Amazing Tour Packages
                    </h1>

                    <p className="text-xl text-blue-100 mb-10">
                        Explore the best travel destinations around the world
                    </p>

                    {/* Search Form */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <input
                                type="text"
                                placeholder="Search packages..."
                                value={searchParams.search}
                                onChange={(e) =>
                                    setSearchParams({
                                        ...searchParams,
                                        search: e.target.value
                                    })
                                }
                                className="px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Location"
                                value={searchParams.location}
                                onChange={(e) =>
                                    setSearchParams({
                                        ...searchParams,
                                        location: e.target.value
                                    })
                                }
                                className="px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            <select
                                value={searchParams.category}
                                onChange={(e) =>
                                    setSearchParams({
                                        ...searchParams,
                                        category: e.target.value
                                    })
                                }
                                className="px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Categories</option>
                                <option value="Domestic">Domestic</option>
                                <option value="International">International</option>
                            </select>

                            <select
                                value={searchParams.duration}
                                onChange={(e) =>
                                    setSearchParams({
                                        ...searchParams,
                                        duration: e.target.value
                                    })
                                }
                                className="px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Any Duration</option>
                                <option value="1-3 Days">1-3 Days</option>
                                <option value="4-7 Days">4-7 Days</option>
                                <option value="8-14 Days">8-14 Days</option>
                                <option value="15+ Days">15+ Days</option>
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Packages Section */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
                    Latest Tour Packages
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
                    </div>
                ) : tourPackages.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-gray-700">
                            No Tour Packages Found
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your search filters.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tourPackages.map((pkg) => (
                                <div
                                    key={pkg._id}
                                    onClick={() => handlePackageClick(pkg._id)}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden"
                                >
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {pkg.title}
                                        </h3>

                                        <p className="text-blue-600 font-medium mb-2">
                                            {pkg.consultancy?.name}
                                        </p>

                                        <p className="text-gray-600 mb-4">
                                            📍 {pkg.location}
                                        </p>

                                        <p className="text-gray-700 line-clamp-3 mb-5">
                                            {pkg.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {pkg.category}
                                            </span>

                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                {pkg.duration}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center border-t pt-4">
                                            <span className="text-2xl font-bold text-green-600">
                                                ${pkg.price?.toLocaleString()}
                                            </span>

                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    pkg.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-5 py-2 border rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;

                                    return (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                            className={`px-4 py-2 rounded-lg ${
                                                currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : "border hover:bg-gray-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-5 py-2 border rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Home;
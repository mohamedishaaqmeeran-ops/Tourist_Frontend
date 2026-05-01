// AdminDashboard.jsx

import { Navigate, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    createConsultancy,
    createConsultant,
    deleteConsultancy,
    getAllConsultancies,
    getAllConsultants,
    updateConsultancy
} from "../services/adminServices";

const AdminDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [consultancies, setConsultancies] = useState([]);
    const [consultants, setConsultants] = useState([]);
    const [activeTab, setActiveTab] = useState("consultancies");
    const [loading, setLoading] = useState(false);

    const [showConsultancyForm, setShowConsultancyForm] = useState(false);
    const [editingConsultancy, setEditingConsultancy] = useState(null);

    const [consultancyData, setConsultancyData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        foundedYear: ""
    });

    const [showConsultantForm, setShowConsultantForm] = useState(false);

    const [consultantData, setConsultantData] = useState({
        name: "",
        email: "",
        password: "",
        consultancyId: ""
    });

    if (user.role !== "admin") {
        toast.error("Unauthorized access. Admins only.");

        if (user.role === "consultant") {
            return <Navigate to="/consultant-dashboard" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    const fetchData = async () => {
        try {
            setLoading(true);

            const [consultanciesRes, consultantsRes] = await Promise.all([
                getAllConsultancies(),
                getAllConsultants()
            ]);

            setConsultancies(consultanciesRes.consultancies || []);
            setConsultants(consultantsRes.consultants || []);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetConsultancyForm = useCallback(() => {
        setConsultancyData({
            name: "",
            description: "",
            website: "",
            location: "",
            foundedYear: ""
        });
        setEditingConsultancy(null);
    }, []);

    const resetConsultantForm = useCallback(() => {
        setConsultantData({
            name: "",
            email: "",
            password: "",
            consultancyId: ""
        });
    }, []);

    const handleCreateConsultancy = async (e) => {
        e.preventDefault();

        try {
            await createConsultancy({
                ...consultancyData,
                foundedYear: consultancyData.foundedYear
                    ? parseInt(consultancyData.foundedYear)
                    : undefined
            });

            toast.success("Consultancy created successfully");
            setShowConsultancyForm(false);
            resetConsultancyForm();
            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to create consultancy"
            );
        }
    };

    const handleUpdateConsultancy = async (e) => {
        e.preventDefault();

        try {
            await updateConsultancy(editingConsultancy._id, {
                ...consultancyData,
                foundedYear: consultancyData.foundedYear
                    ? parseInt(consultancyData.foundedYear)
                    : undefined
            });

            toast.success("Consultancy updated successfully");
            setShowConsultancyForm(false);
            resetConsultancyForm();
            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update consultancy"
            );
        }
    };

    const handleDeleteConsultancy = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await deleteConsultancy(id);
            toast.success("Consultancy deleted successfully");
            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to delete consultancy"
            );
        }
    };

    const handleCreateConsultant = async (e) => {
        e.preventDefault();

        try {
            await createConsultant(consultantData);
            toast.success("Consultant created successfully");
            setShowConsultantForm(false);
            resetConsultantForm();
            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to create consultant"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    Admin Dashboard
                </h1>

                <div className="mb-8 border-b">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() =>
                                setActiveTab("consultancies")
                            }
                            className={`py-3 px-1 border-b-2 font-medium ${
                                activeTab === "consultancies"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500"
                            }`}
                        >
                            Consultancies ({consultancies.length})
                        </button>

                        <button
                            onClick={() =>
                                setActiveTab("consultants")
                            }
                            className={`py-3 px-1 border-b-2 font-medium ${
                                activeTab === "consultants"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500"
                            }`}
                        >
                            Consultants ({consultants.length})
                        </button>
                    </nav>
                </div>

                {/* CONSULTANCIES TAB */}
                {activeTab === "consultancies" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">
                                Consultancies
                            </h2>

                            <button
                                onClick={() =>
                                    setShowConsultancyForm(
                                        !showConsultancyForm
                                    )
                                }
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                {showConsultancyForm
                                    ? "Cancel"
                                    : "Add Consultancy"}
                            </button>
                        </div>

                        {showConsultancyForm && (
                            <div className="bg-white rounded-xl shadow p-6 mb-8">
                                <form
                                    onSubmit={
                                        editingConsultancy
                                            ? handleUpdateConsultancy
                                            : handleCreateConsultancy
                                    }
                                    className="space-y-4"
                                >
                                    <input
                                        type="text"
                                        placeholder="Consultancy Name"
                                        value={consultancyData.name}
                                        onChange={(e) =>
                                            setConsultancyData({
                                                ...consultancyData,
                                                name: e.target.value
                                            })
                                        }
                                        className="w-full p-3 border rounded-lg"
                                        required
                                    />

                                    <textarea
                                        placeholder="Description"
                                        value={
                                            consultancyData.description
                                        }
                                        onChange={(e) =>
                                            setConsultancyData({
                                                ...consultancyData,
                                                description:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full p-3 border rounded-lg"
                                        rows="4"
                                        required
                                    />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="url"
                                            placeholder="Website"
                                            value={
                                                consultancyData.website
                                            }
                                            onChange={(e) =>
                                                setConsultancyData({
                                                    ...consultancyData,
                                                    website:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={
                                                consultancyData.location
                                            }
                                            onChange={(e) =>
                                                setConsultancyData({
                                                    ...consultancyData,
                                                    location:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                            required
                                        />
                                    </div>

                                    <input
                                        type="number"
                                        placeholder="Founded Year"
                                        value={
                                            consultancyData.foundedYear
                                        }
                                        onChange={(e) =>
                                            setConsultancyData({
                                                ...consultancyData,
                                                foundedYear:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full p-3 border rounded-lg"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg"
                                    >
                                        {editingConsultancy
                                            ? "Update Consultancy"
                                            : "Create Consultancy"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {consultancies.map(
                                    (consultancy) => (
                                        <div
                                            key={consultancy._id}
                                            className="bg-white rounded-xl shadow p-6"
                                        >
                                            <h3 className="text-xl font-bold mb-2">
                                                {
                                                    consultancy.name
                                                }
                                            </h3>

                                            <p className="text-gray-600 mb-3">
                                                {
                                                    consultancy.location
                                                }
                                            </p>

                                            <p className="text-sm text-gray-500 mb-4">
                                                Founded:{" "}
                                                {consultancy.foundedYear ||
                                                    "N/A"}
                                            </p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingConsultancy(
                                                            consultancy
                                                        );
                                                        setConsultancyData(
                                                            {
                                                                name: consultancy.name,
                                                                description:
                                                                    consultancy.description,
                                                                website:
                                                                    consultancy.website,
                                                                location:
                                                                    consultancy.location,
                                                                foundedYear:
                                                                    consultancy.foundedYear ||
                                                                    ""
                                                            }
                                                        );
                                                        setShowConsultancyForm(
                                                            true
                                                        );
                                                    }}
                                                    className="flex-1 bg-yellow-500 text-white py-2 rounded"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteConsultancy(
                                                            consultancy._id
                                                        )
                                                    }
                                                    className="flex-1 bg-red-500 text-white py-2 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* CONSULTANTS TAB */}
                {activeTab === "consultants" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">
                                Consultants
                            </h2>

                            <button
                                onClick={() =>
                                    setShowConsultantForm(
                                        !showConsultantForm
                                    )
                                }
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                {showConsultantForm
                                    ? "Cancel"
                                    : "Add Consultant"}
                            </button>
                        </div>

                        {showConsultantForm && (
                            <div className="bg-white rounded-xl shadow p-6 mb-8">
                                <form
                                    onSubmit={
                                        handleCreateConsultant
                                    }
                                    className="space-y-4"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={
                                                consultantData.name
                                            }
                                            onChange={(e) =>
                                                setConsultantData({
                                                    ...consultantData,
                                                    name:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                            required
                                        />

                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={
                                                consultantData.email
                                            }
                                            onChange={(e) =>
                                                setConsultantData({
                                                    ...consultantData,
                                                    email:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={
                                                consultantData.password
                                            }
                                            onChange={(e) =>
                                                setConsultantData({
                                                    ...consultantData,
                                                    password:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                            required
                                        />

                                        <select
                                            value={
                                                consultantData.consultancyId
                                            }
                                            onChange={(e) =>
                                                setConsultantData({
                                                    ...consultantData,
                                                    consultancyId:
                                                        e.target.value
                                                })
                                            }
                                            className="p-3 border rounded-lg"
                                            required
                                        >
                                            <option value="">
                                                Select Consultancy
                                            </option>

                                            {consultancies.map(
                                                (
                                                    consultancy
                                                ) => (
                                                    <option
                                                        key={
                                                            consultancy._id
                                                        }
                                                        value={
                                                            consultancy._id
                                                        }
                                                    >
                                                        {
                                                            consultancy.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg"
                                    >
                                        Create Consultant
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Consultancy
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {consultants.map(
                                        (consultant) => (
                                            <tr
                                                key={
                                                    consultant._id
                                                }
                                                className="border-t"
                                            >
                                                <td className="px-6 py-4">
                                                    {
                                                        consultant.name
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        consultant.email
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {consultant
                                                        .assignedConsultancy
                                                        ?.name ||
                                                        "Not Assigned"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        consultant.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
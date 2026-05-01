import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";
import { clearUser } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";
import logo from "../assets/hero.png";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUser());
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch {
            toast.error("Error logging out");
            dispatch(clearUser());
            navigate("/login", { replace: true });
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img
                            src={logo}
                            alt="Aura Holidays"
                            className="w-12 h-12 object-contain"
                        />
                        <h1 className="text-2xl font-bold text-blue-700 hidden sm:block">
                            Aura Holidays
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Home
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="relative group">
                                <button className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100">
                                    <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </span>

                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>
                                </button>

                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Home
                            </Link>

                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <p className="font-semibold">
                                            {user?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>

                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-red-600 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
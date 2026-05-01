import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import store from "./redux/store";
import BookingDetails from "./pages/BookingDetails";
// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import TourPackageDetails from "./pages/TourPackageDetails";
import TourPackages from "./pages/TourPackages";

// Loaders
import { adminLoader, consultantLoader, userLoader } from "./loaders/roleLoaders";
import authLoader from "./loaders/authLoader";

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: authLoader,
  },
  {
    path: "/tourpackages",
    element: <TourPackages />,
    loader: authLoader,
  },
  {
    path: "/tourpackage/:tourpackageId",
    element: <TourPackageDetails />,
    loader: authLoader,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
    loader: userLoader,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: adminLoader,
  },
  {
    path: "/consultant/dashboard",
    element: <ConsultantDashboard />,
    loader: consultantLoader,
  },
  {
    path: "/bookings/:bookingId",
    element: <BookingDetails />,
    loader: authLoader,
},
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider
        router={router}
        fallbackElement={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        }
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
};

export default App;
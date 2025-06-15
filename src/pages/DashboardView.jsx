import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaHome,
} from "react-icons/fa";

const dashboardLinks = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/search", label: "Search Products", icon: <FaSearch /> },
  { to: "/cart", label: "Cart", icon: <FaShoppingCart /> },
  { to: "/my-orders", label: "My Orders", icon: <FaBoxOpen /> },
  { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
  { to: "/dashboard", label: "Wishlist", icon: <FaHeart /> },
];

const DashboardView = () => (
  <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-8rem)] flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-10 text-secondary-200 tracking-tight drop-shadow">
      Dashboard
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-3xl">
      {dashboardLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-900/80 rounded-2xl shadow-lg border border-gray-800 hover:border-secondary-200 hover:shadow-xl transition-all duration-200 group"
        >
          <span className="text-4xl text-secondary-200 group-hover:scale-110 group-hover:text-white transition-transform duration-200">
            {link.icon}
          </span>
          <span className="text-lg font-semibold text-gray-100 group-hover:text-secondary-200 transition-colors duration-200">
            {link.label}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default DashboardView;

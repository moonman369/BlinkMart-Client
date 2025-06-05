import React from "react";
import { FaSpinner } from "react-icons/fa";
import logo from "../assets/logo.png"; // Adjust path as needed

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center max-w-md mx-auto p-6 text-center">
        <img
          src={logo}
          alt="BlinkMart Logo"
          className="w-32 h-32 object-contain mb-6"
        />

        <div className="animate-spin text-secondary-200 mb-4">
          <FaSpinner size={36} />
        </div>

        <h2 className="text-xl font-semibold mb-2 text-white">{message}</h2>

        <p className="text-gray-400 text-sm">
          Please wait while we log you in...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

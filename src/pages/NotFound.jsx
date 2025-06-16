import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import notFoundImage from "../assets/not_found.webp";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[280px] mx-auto mb-6">
            <img
              src={notFoundImage}
              alt="Page not found"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Oops! Page Not Found
          </h1>

          <p className="text-gray-400 text-center mb-8">
            The page you're looking for doesn't seem to exist or might have been
            moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={goBack}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors w-full"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-200 to-secondary-200 hover:from-primary-100 hover:to-secondary-200 text-gray-900 font-medium rounded-lg transition-all w-full"
            >
              <FaHome />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

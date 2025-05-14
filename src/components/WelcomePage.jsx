import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const WelcomePage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to{" "}
            <span className="tracking-wider">
              <span className="text-secondary-200">BLINK</span>
              <span className="text-primary-200">MART</span>
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Your one-stop destination for all your shopping needs. Discover
            amazing products and exclusive deals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-secondary-200/20 transition-all">
            <div className="text-primary-200 text-4xl mb-4 flex justify-center">
              <FaShoppingCart />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Shop Now</h3>
            <p className="text-gray-400 text-center mb-4">
              Browse through our extensive collection of products
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-secondary-200/20 transition-all">
            <div className="text-primary-200 text-4xl mb-4 flex justify-center">
              <FaUserPlus />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">
              Create Account
            </h3>
            <p className="text-gray-400 text-center mb-4">
              Join our community and unlock exclusive benefits
            </p>
            <Link
              to="/register"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
            >
              Register Now
            </Link>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-secondary-200/20 transition-all">
            <div className="text-primary-200 text-4xl mb-4 flex justify-center">
              <FaSignInAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Sign In</h3>
            <p className="text-gray-400 text-center mb-4">
              Access your account and manage your orders
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

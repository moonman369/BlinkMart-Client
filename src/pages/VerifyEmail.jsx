import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaEnvelope,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import customAxios from "../util/customAxios";
import { showToast } from "../config/toastConfig";
import { setUserDetails } from "../store/userSlice"; // Assuming this action exists
import { apiSummary } from "../config/api/apiSummary";
import { fetchUserDetails } from "../util/fetchUserDetails";
import LoadingSpinner from "../components/LoadingSpinner";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Method to call verify email API
  const verifyEmailToken = async () => {
    try {
      setIsLoading(true);
      const response = await customAxios({
        url: apiSummary.endpoints.user.verifyEmail.path,
        method: apiSummary.endpoints.user.verifyEmail.method,
        data: { verificationCode: code },
      });

      if (
        response.status === apiSummary.endpoints.user.verifyEmail.successStatus
      ) {
        showToast.success("Email verified successfully!");

        // Update user state to reflect verified email
        let updatedUser = await fetchUserDetails();
        dispatch(setUserDetails(updatedUser));
        setIsVerified(true);
      }
    } catch (error) {
      if (
        error.response.status ===
        apiSummary.endpoints.user.verifyEmail.alredyVerifiedStatus
      ) {
        showToast.success("Email is already verified.");
        setIsVerified(true);
        return;
      }
      setIsVerified(false);
      console.error("Email verification error:", error);
      showToast.error("Email verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (code) {
      verifyEmailToken();
    } else {
      setIsVerified(false);
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 shadow-xl border border-gray-700 rounded-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-primary-200 to-secondary-200 p-3 rounded-full">
            <FaEnvelope className="text-gray-900 text-2xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Verify Email</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : isVerified ? (
          <div className="text-center py-6 px-4 bg-gray-700/30 rounded-lg border border-green-500/30">
            <FaCheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <p className="mt-2 text-lg text-green-400 font-medium">Your email has been successfully verified!</p>
            <p className="mt-2 text-gray-400">You can now access all features of your account.</p>
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-gray-700/30 rounded-lg border border-red-500/30">
            <FaTimesCircle size={64} className="mx-auto text-red-500 mb-4" />
            <p className="mt-2 text-lg text-red-400 font-medium">Verification failed.</p>
            <p className="mt-2 text-gray-400">The verification link might be expired or invalid. Please try again.</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-300">
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-200 to-secondary-200 hover:from-primary-100 hover:to-secondary-200 text-gray-900 font-medium rounded-lg transition-all duration-300">
            <FaArrowLeft /> <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

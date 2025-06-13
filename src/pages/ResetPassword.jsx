import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../config/toastConfig";

const ResetPassword = () => {
  const [userData, setUserData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isUserDataPopulated, setIsUserDataPopulated] = useState(
    Object.values(userData).every((x) => x)
  );
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    if (
      !location?.state?.email ||
      !location?.state?.verifyOtpResponse?.success
    ) {
      navigate("/forgot-password");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const toggleShowNewPassword = () => {
    if (!userData.newPassword || userData.newPassword === "") {
      return;
    }
    setShowNewPassword((currentValue) => !currentValue);
  };

  const toggleShowConfirmNewPassword = () => {
    if (!userData.confirmNewPassword || userData.confirmNewPassword === "") {
      return;
    }
    setShowConfirmNewPassword((currentValue) => !currentValue);
  };

  useEffect(() => {
    setIsUserDataPopulated(Object.values(userData).every((x) => x));
  }, [userData]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isUserDataPopulated) {
        showToast.error("Fill in all the user details and try again!");
        return;
      }

      const response = await customAxios({
        url: apiSummary.endpoints.user.resetPassword.path,
        method: apiSummary.endpoints.user.resetPassword.method,
        data: {
          email: location?.state?.email,
          newPassword: userData.newPassword,
          confirmNewPassword: userData.confirmNewPassword,
        },
      });

      console.log(`Login Response: `, response);
      if (
        response?.status ===
        apiSummary.endpoints.user.resetPassword.successStatus
      ) {
        showToast.success("Your Password has been successfully reset!🎉");
      }
      navigate("/login");
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };

  console.log(userData);
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-gray-900 my-4 w-full max-w-lg mx-auto rounded p-6">
        <div className="flex text-2xl justify-center">
          {/* <h1>LOGIN TO &nbsp;</h1> */}
          <h1 className="tracking-wider">
            <b className="text-secondary-200">RESET&nbsp;</b>
            <b className="text-primary-200">PASSWORD</b>
          </h1>
        </div>
        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="grid gap-1 mt-3">
            <label htmlFor="password">New Password* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className="w-full bg-transparent outline-none"
                value={userData.newPassword}
                onChange={handleInputChange}
              />
              <div onClick={toggleShowNewPassword} className="cursor-pointer">
                {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="grid gap-1 mt-3">
            <label htmlFor="confirmPassword">Confirm New Password* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                className="w-full bg-transparent outline-none"
                value={userData.confirmNewPassword}
                onChange={handleInputChange}
              />
              <div
                onClick={toggleShowConfirmNewPassword}
                className="cursor-pointer"
              >
                {showConfirmNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
          </div>

          <button
            disabled={!isUserDataPopulated}
            className={`${
              isUserDataPopulated
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-500"
            } text-white py-3 rounded font-semibold my-8 tracking-wider w-full`}
          >
            Reset Password
          </button>
        </form>
        <div className="flex justify-center text-[12px]">
          <p className="">
            Don't have an account?&nbsp;
            <Link
              className="font-semibold text-primary-200 hover:text-secondary-200 hover:underline"
              to={"/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

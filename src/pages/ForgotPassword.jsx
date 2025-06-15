import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../config/toastConfig";

const ForgotPassword = () => {
  const [userData, setUserData] = useState({
    email: "",
  });
  const [isUserDataPopulated, setIsUserDataPopulated] = useState(
    Object.values(userData).every((x) => x)
  );
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
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
        url: apiSummary.endpoints.user.forgotPassword.path,
        method: apiSummary.endpoints.user.forgotPassword.method,
        data: {
          email: userData.email,
        },
      });

      console.log(`Forgot Password Response: `, response);
      if (
        response?.status ===
        apiSummary.endpoints.user.forgotPassword.successStatus
      ) {
        showToast.success(response.data["message"]);
        navigate("/verify-otp", {
          state: {
            email: userData.email,
          },
        });
      }
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
          <h1>FORGOT &nbsp;</h1>
          <h1 className="tracking-wider">
            <b className="text-secondary-200">BLINK</b>
            <b className="text-primary-200">MART</b>
          </h1>
          <h1>&nbsp; PASSWORD</h1>
        </div>
        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="grid gap-1 focus-within:border-secondary-200 mt-3">
            <label htmlFor="email">Email* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="email"
                type="email"
                name="email"
                className="w-full bg-transparent outline-none"
                value={userData.email}
                onChange={handleInputChange}
              />
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
            Send OTP
          </button>
        </form>
        <div className="flex justify-center text-[12px]">
          <p className="">
            Already have an account?&nbsp;
            <Link
              className="font-semibold text-primary-200 hover:text-secondary-200 hover:underline"
              to={"/login"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

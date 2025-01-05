import React, { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { customAxios } from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [userData, setUserData] = useState(["", "", "", "", "", ""]);
  const [isUserDataPopulated, setIsUserDataPopulated] = useState(
    Object.values(userData).every((x) => x)
  );
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  useEffect(() => {
    setIsUserDataPopulated(userData.every((x) => x));
  }, [userData]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isUserDataPopulated) {
        toast.error("Fill in all the user details and try again!");
        return;
      }

      const response = await customAxios({
        url: apiSummary.endpoints.verifyOtp.path,
        method: apiSummary.endpoints.verifyOtp.method,
        data: {
          email: location?.state?.email,
          otp: userData.join(""),
        },
      });

      console.log(`Verify OTP Response: `, response);
      if (response?.status === apiSummary.endpoints.verifyOtp.successStatus) {
        toast.success(response.data["message"]);
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
          {/* <h1>FORGOT &nbsp;</h1> */}
          <h1 className="tracking-wider">
            <b className="text-secondary-200">VERIFY&nbsp;</b>
            <b className="text-primary-200">OTP</b>
          </h1>
          {/* <h1>&nbsp; PASSWORD</h1> */}
        </div>
        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="grid gap-1 focus-within:border-secondary-200 mt-3">
            <label htmlFor="otp">One Time Password (OTP)* </label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {userData.map((_, index) => {
                return (
                  <input
                    key={`otp_${index}`}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={userData[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      //   console.log(value);
                      const newData = [...userData];
                      newData[index] = value;
                      setUserData(newData);

                      if (value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    maxLength={1}
                    className="w-full max-w-16 bg-transparent outline-none p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200 text-center font-semibold"
                  />
                );
              })}
            </div>
            <div className=""></div>
          </div>

          <button
            disabled={!isUserDataPopulated}
            className={`${
              isUserDataPopulated
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-500"
            } text-white py-3 rounded font-semibold my-8 tracking-wider w-full`}
          >
            Verify OTP
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

export default VerifyOTP;

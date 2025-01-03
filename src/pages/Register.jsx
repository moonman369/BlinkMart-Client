import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { customAxios } from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserDataPopulated, setIsUserDataPopulated] = useState(
    Object.values(userData).every((x) => x)
  );
  const [passwordsMatch, setPasswordsMatch] = useState(
    userData?.password === userData?.confirmPassword
  );
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const toggleShowPassword = () => {
    if (!userData.password || userData.password === "") {
      return;
    }
    setShowPassword((currentValue) => !currentValue);
  };

  const toggleShowConfirmPassword = () => {
    if (!userData.confirmPassword || userData.confirmPassword === "") {
      return;
    }
    setShowConfirmPassword((currentValue) => !currentValue);
  };

  useEffect(() => {
    setIsUserDataPopulated(Object.values(userData).every((x) => x));
    setPasswordsMatch(userData?.password === userData?.confirmPassword);
  }, [userData]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isUserDataPopulated) {
        toast.error("Fill in all the user details and try again!");
        return;
      }
      if (!passwordsMatch) {
        toast.error("Password and Confirm Password don't match!");
        return;
      }

      const response = await customAxios({
        url: apiSummary.endpoints.register.path,
        method: apiSummary.endpoints.register.method,
        data: {
          username: userData.name,
          email: userData.email,
          password: userData.password,
        },
      });

      console.log(`Register Response: `, response);
      if (response?.status === apiSummary.endpoints.register.successStatus) {
        toast.success("User has been created successfully!🎉");
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
          <h1>WELCOME TO &nbsp;</h1>
          <h1 className="tracking-wider">
            <b className="text-secondary-200">BLINK</b>
            <b className="text-primary-200">MART</b>
          </h1>
        </div>
        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid gap-1 focus-within:border-primary-200 mt-3">
            <label htmlFor="name">Name* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="name"
                type="text"
                name="name"
                autoFocus
                className="w-full bg-transparent outline-none"
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

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

          {/* Password */}
          <div className="grid gap-1 mt-3">
            <label htmlFor="password">Password* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full bg-transparent outline-none"
                value={userData.password}
                onChange={handleInputChange}
              />
              <div onClick={toggleShowPassword} className="cursor-pointer">
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1 mt-3">
            <label htmlFor="confirmPassword">Confirm Password* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full bg-transparent outline-none"
                value={userData.confirmPassword}
                onChange={handleInputChange}
              />
              <div
                onClick={toggleShowConfirmPassword}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
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
            Register
          </button>
        </form>
        <p className="flex justify-center text-[12px]">
          Already have an account?&nbsp;
          <Link
            className="font-semibold text-primary-200 hover:text-secondary-200 hover:underline"
            to={"/login"}
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const isUserDataPopulated = Object.values(userData).every((x) => x);

  console.log(userData);
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-gray-900 my-4 w-full max-w-lg mx-auto rounded p-4">
        <p>Welcome to BlinkMart</p>
        <form className="grid gap-2 mt-6">
          {/* Name */}
          <div className="grid gap-1 focus-within:border-primary-200 mt-3">
            <label htmlFor="name">Name* </label>
            <input
              id="name"
              type="text"
              name="name"
              autoFocus
              className="p-2 border rounded bg-gray-700 focus-within:border-primary-200"
              value={userData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1 focus-within:border-secondary-200 mt-3">
            <label htmlFor="email">Email* </label>
            <input
              id="email"
              type="email"
              name="email"
              autoFocus
              className="p-2 border rounded bg-gray-700 focus-within:border-primary-200"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1 mt-3">
            <label htmlFor="password">Password* </label>
            <div className="p-2 border rounded bg-gray-700 flex items-center focus-within:border-primary-200">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoFocus
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
                autoFocus
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
            className={`${
              isUserDataPopulated ? "bg-green-700" : "bg-gray-500"
            } text-white py-3 rounded font-semibold my-8 tracking-wider w-full`}
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;

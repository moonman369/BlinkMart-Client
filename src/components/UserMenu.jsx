import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Divider from "./Divider";
import customAxios from "../util/customAxios.js";
import { apiSummary } from "../config/api/apiSummary";
import { resetUserDetails } from "../store/userSlice.js";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError.js";

const UserMenu = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.logout.path,
        method: apiSummary.endpoints.logout.method,
      });

      if (response.status === apiSummary.endpoints.logout.successStatus) {
        dispatch(resetUserDetails());
        localStorage.clear();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  return (
    <div>
      <div className="font-semibold mb-5">My Account</div>
      <div className="text-sm">{user.username || user.mobile}</div>
      <Divider />
      <div className="text-sm grid gap-2 mt-3">
        <Link to={""} className="px-2 hover:text-primary-200">
          My Orders
        </Link>
        <Link to={""} className="px-2 hover:text-primary-200">
          Saved Addresses
        </Link>
        <button
          className="text-left text-red-400 font-semibold hover:text-red-600 rounded px-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

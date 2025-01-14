import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import customAxios from "../util/customAxios.js";
import { apiSummary } from "../config/api/apiSummary";
import { resetUserDetails } from "../store/userSlice.js";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError.js";
import { HiOutlineExternalLink } from "react-icons/hi";

const UserMenu = ({ isMobile }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      if (isMobile) {
        navigate(-1);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  return (
    <div className="p-2">
      <div className="font-semibold mb-1">My Account</div>
      <div className="text-sm mb-1">
        <Link
          to={"/dashboard/profile"}
          className="flex gap-2 hover:text-secondary-200"
        >
          <span className="max-w-52 text-ellipsis line-clamp-1">
            {user.username || user.mobile}
          </span>
          <HiOutlineExternalLink size={20} />
        </Link>
      </div>
      <Divider />
      <div className="text-sm grid gap-4 mt-4">
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

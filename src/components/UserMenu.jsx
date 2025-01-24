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

const UserMenu = ({ isMobile, close }) => {
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
      navigate("/");
    } catch (error) {
      axiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div className="p-2">
      <div className="font-semibold mb-1">My Account</div>
      <div className="text-sm mb-1">
        <Link
          onClick={handleClose}
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
      <div className="text-sm grid gap-2 mt-4">
        <Link
          onClick={handleClose}
          to={"/dashboard/products"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          Products
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/categories"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          Categories
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/sub-categories"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          Sub-Categories
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/products"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          Upload Product
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/my-orders"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/addresses"}
          className="p-2 hover:text-primary-200 hover:bg-gray-800 rounded-md"
        >
          Saved Addresses
        </Link>
        <button
          className="text-left text-red-400 font-semibold hover:text-red-600 hover:bg-gray-800 rounded p-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

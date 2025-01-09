import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Divider from "./Divider";

const UserMenu = () => {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <div className="font-semibold mb-5">My Account</div>
      <div className="text-sm">{user.username || user.mobile}</div>
      <Divider />
      <div className="text-sm grid gap-2 mt-3">
        <Link to={""} className="px-2">
          My Orders
        </Link>
        <Link to={""} className="px-2">
          Saved Addresses
        </Link>
        <button className="text-left text-red-600 font-semibold rounded px-2">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

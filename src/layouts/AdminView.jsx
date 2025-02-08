import { isAction } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import { isAdmin } from "../util/isAdmin";

const AdminView = ({ children }) => {
  const user = useSelector((state) => state.user);
  return (
    <>
      {isAdmin(user) ? (
        children
      ) : (
        <p className="text-red-500 flex items-center justify-center ">
          You don't have permission to visit this page...
        </p>
      )}
    </>
  );
};

export default AdminView;

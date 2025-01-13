import React from "react";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const UserMenuMobilePage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-black py-5">
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="block w-fit ml-auto p-5"
      >
        <IoClose size={22} className="" />
      </button>
      <div className="container mx-auto p-3 h-full w-full">
        <UserMenu isMobile={true} />
      </div>
    </section>
  );
};

export default UserMenuMobilePage;

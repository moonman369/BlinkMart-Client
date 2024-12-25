import React from "react";
import logo from "../assets/blinkmart-logo-3.png";
import Search from "./Search";
import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="h-28 lg:h-21 shadow-md sticky top-0 bg-black text-gray-200 flex flex-col gap-2 items-center justify-center px-1 pb-3">
      <div className="container mx-auto flex items-center h-full pr-2 justify-between">
        {/* logo */}
        <div className="h-full">
          <Link to={"/"} className="h-full flex justify-center items-center">
            <img
              src={logo}
              width={150}
              height={80}
              alt="logo"
              className="hidden lg:block"
            />
            <img
              src={logo}
              width={90}
              height={80}
              alt="logo"
              className="lg:hidden"
            />
          </Link>
        </div>

        {/* search */}
        <div className="hidden lg:block">
          <Search></Search>
        </div>

        {/* login and cart */}
        <div>
          <button className="text-neutral-400 lg:hidden">
            <FaRegCircleUser size={26} />
          </button>
          <div className="hidden lg:block">Login and Cart</div>
        </div>
      </div>
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;

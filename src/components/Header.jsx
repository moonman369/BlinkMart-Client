import React, { useEffect, useState } from "react";
import logo from "../assets/blinkmart-logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { useMobile } from "../hooks/useMobile";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { use } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchPage, setIsSearchPage] = useState(
    location?.pathname === "/search"
  );
  const user = useSelector((state) => state?.user);

  console.log(`User From store: `, user);

  useEffect(() => {
    setIsSearchPage(location?.pathname === "/search");
  }, [location]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  console.log(isMobile);
  return (
    <header className="h-28 lg:h-21 shadow-sm shadow-secondary-200 sticky top-0 bg-black text-gray-200 flex flex-col gap-2 items-center justify-center p-2">
      {!(isSearchPage && isMobile) && (
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
            {/* mobile */}
            <button className="text-neutral-400 lg:hidden">
              <FaRegCircleUser size={26} />
            </button>

            {/* desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user._id ? (
                <div className="f">
                  <div className="flex items-center gap-2">
                    <p>Account</p>
                    <GoTriangleDown />
                    {/* <GoTriangleUp /> */}
                  </div>
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-3 rounded text-white">
                <div className="animate-bounce">
                  <TiShoppingCart size={30} />
                </div>
                <div className="font-semibold">
                  <p>My Cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;

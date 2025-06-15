import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/blinkmart-logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { useMobile } from "../hooks/useMobile";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { use } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import useCloseOnOutsideClick from "../hooks/useCloseOnOutsideClick";
import { getINRString } from "../util/getINRString";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchPage, setIsSearchPage] = useState(
    location?.pathname === "/search"
  );
  const user = useSelector((state) => state?.user);
  const cart = useSelector((state) => state?.cart);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const accountRef = useRef(null);

  // Close menu on outside click
  useCloseOnOutsideClick([userMenuRef, accountRef], (event) => {
    // Don't close if clicking on a Link component
    if (event.target.tagName === "A" || event.target.closest("a")) {
      return;
    }
    setOpenUserMenu(false);
  });

  // Close menu on navigation
  useEffect(() => {
    setOpenUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    setIsSearchPage(location?.pathname === "/search");
  }, [location]);

  useEffect(() => {
    setOpenUserMenu(false);
  }, [user]);

  // console.log(`User From store: `, user);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleMobileUserMenu = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    } else {
      navigate("/user");
    }
  };

  // console.log(isMobile);
  // console.log("Cart:", cart);
  return (
    <header className="h-28 lg:h-21 shadow-sm shadow-secondary-200 sticky top-0 bg-black text-gray-200 flex flex-col gap-2 items-center justify-center p-2 z-50">
      {
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
          <div className="">
            {/* mobile */}
            <div className="flex items-center gap-4 lg:hidden">
              <Link
                to="/cart"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-2 py-1.5 rounded text-white"
              >
                <div className="animate-bounce">
                  <TiShoppingCart size={24} />
                </div>
                {cart?.totalQuantity > 0 && (
                  <span className="text-sm font-semibold">
                    {cart.totalQuantity}
                  </span>
                )}
              </Link>
              <button
                className={`${
                  user?._id ? "text-secondary-200" : "text-primary-200"
                } lg:hidden`}
                onClick={handleMobileUserMenu}
              >
                <FaRegCircleUser size={26} />
              </button>
            </div>

            {/* desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user._id ? (
                <div className="relative">
                  <div
                    ref={accountRef}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => {
                      setOpenUserMenu((initValue) => !initValue);
                    }}
                  >
                    {openUserMenu ? (
                      <>
                        <p>Account</p>
                        <GoTriangleUp size={20} />
                      </>
                    ) : (
                      <>
                        <p>Account</p>
                        <GoTriangleDown size={20} />
                      </>
                    )}
                  </div>
                  {openUserMenu ? (
                    <div className="absolute right-0 top-16">
                      <div
                        className="bg-black rounded p-4 min-w-52 shadow-sm shadow-secondary-200"
                        ref={userMenuRef}
                      >
                        <UserMenu
                          close={() => {
                            setOpenUserMenu(false);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-3 rounded text-white"
                onClick={() => navigate("/cart")}
              >
                <div className="animate-bounce">
                  <TiShoppingCart size={30} />
                </div>
                <div className="font-semibold">
                  {cart?.totalQuantity > 0 ? (
                    <div>
                      <p>{cart?.totalQuantity} items</p>
                      <p className="text-xs">
                        {getINRString(cart?.totalPrice)}
                      </p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      }

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;

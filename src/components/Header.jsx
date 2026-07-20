import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiShoppingCart, FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import logo from "../assets/blinkmart-logo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import useCloseOnOutsideClick from "../hooks/useCloseOnOutsideClick";
import { getINRString } from "../util/getINRString";
import { cn } from "../util/cn";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const cart = useSelector((state) => state?.cart);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const accountRef = useRef(null);

  const totalQuantity = cart?.totalQuantity || 0;

  useCloseOnOutsideClick([userMenuRef, accountRef], (event) => {
    if (event.target.tagName === "A" || event.target.closest("a")) return;
    setOpenUserMenu(false);
  });

  useEffect(() => {
    setOpenUserMenu(false);
  }, [location.pathname, user]);

  // Header gains a border + shadow once the page scrolls, so it reads as
  // elevated above the content rather than always looking detached.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileUserMenu = () => navigate(user?._id ? "/user" : "/login");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex flex-col items-center justify-center gap-2 p-2",
        "bg-surface-base/85 backdrop-blur-xl transition-all duration-base ease-out",
        scrolled
          ? "border-b border-surface-border shadow-e2"
          : "border-b border-transparent"
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between gap-4 pr-1">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={logo}
            alt="BlinkMart"
            className="h-9 w-auto object-contain lg:h-12"
          />
        </Link>

        {/* Search — desktop */}
        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <Search />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/cart"
            aria-label={`Cart, ${totalQuantity} items`}
            className="pressable relative rounded-xl bg-mint-600 p-2.5 text-white shadow-e1"
          >
            <FiShoppingCart size={20} />
            <CartBadge count={totalQuantity} />
          </Link>
          <button
            aria-label="Account"
            onClick={handleMobileUserMenu}
            className={cn(
              "pressable rounded-xl border border-surface-border p-2.5 transition-colors",
              user?._id ? "text-mint-400" : "text-brand-400"
            )}
          >
            <FaRegCircleUser size={20} />
          </button>
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {user?._id ? (
            <div className="relative">
              <button
                ref={accountRef}
                onClick={() => setOpenUserMenu((v) => !v)}
                className="flex select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary"
              >
                Account
                <motion.span
                  animate={{ rotate: openUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex"
                >
                  <FiChevronDown size={16} />
                </motion.span>
              </button>

              <AnimatePresence>
                {openUserMenu && (
                  <motion.div
                    ref={userMenuRef}
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-[calc(100%+12px)] min-w-56 origin-top-right rounded-card border border-surface-border bg-surface-overlay p-4 shadow-e3"
                  >
                    <UserMenu close={() => setOpenUserMenu(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary"
            >
              Login
            </button>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="pressable relative flex items-center gap-2.5 rounded-xl bg-mint-600 px-4 py-2.5 text-white shadow-e1 transition-shadow hover:shadow-glow-mint"
          >
            <div className="relative">
              <FiShoppingCart size={20} />
            </div>
            {totalQuantity > 0 ? (
              <div className="text-left leading-tight">
                <p className="text-xs font-bold">{totalQuantity} items</p>
                <p className="text-2xs tabular-nums opacity-90">
                  {getINRString(cart?.totalPrice || 0)}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold">My Cart</p>
            )}
          </button>
        </div>
      </div>

      {/* Search — mobile */}
      <div className="container mx-auto px-1 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

/** Count pill that pops when the quantity changes. */
const CartBadge = ({ count }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.span
        key={count}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-2xs font-extrabold tabular-nums text-surface-base ring-2 ring-surface-base"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    )}
  </AnimatePresence>
);

export default Header;

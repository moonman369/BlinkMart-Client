import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowRight } from "react-icons/fi";
import { getINRString } from "../util/getINRString";

// Routes where the cart is already the subject of the page
const HIDDEN_ON = ["/cart", "/checkout"];

/**
 * Persistent cart summary pinned to the bottom of the viewport.
 *
 * Keeps the cart one tap away while browsing, which is the pattern users
 * expect from quick-commerce apps. Mobile-only; desktop has the header cart.
 */
const StickyCartBar = () => {
  const cart = useSelector((state) => state?.cart);
  const navigate = useNavigate();
  const location = useLocation();

  const totalQuantity = cart?.totalQuantity || 0;
  const isHidden = HIDDEN_ON.some((path) =>
    location.pathname.startsWith(path)
  );
  const visible = totalQuantity > 0 && !isHidden;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={() => navigate("/cart")}
            className="pressable flex w-full items-center justify-between gap-3 rounded-sheet bg-mint-600 px-4 py-3 shadow-e4"
          >
            <div className="flex items-center gap-3">
              {/* Stacked thumbnails of what's in the cart */}
              <div className="flex -space-x-2.5">
                {cart.items.slice(0, 3).map((item) => (
                  <img
                    key={item._id}
                    src={item?.product?.image?.[0]}
                    alt=""
                    className="h-8 w-8 rounded-lg border-2 border-mint-600 bg-white object-contain p-0.5"
                  />
                ))}
                {cart.items.length > 3 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-mint-600 bg-mint-700 text-2xs font-bold text-white">
                    +{cart.items.length - 3}
                  </span>
                )}
              </div>

              <div className="text-left leading-tight text-white">
                <p className="text-xs font-semibold opacity-90">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </p>
                <p className="text-sm font-extrabold tabular-nums">
                  {getINRString(cart?.totalPrice || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
              View Cart
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex"
              >
                <FiArrowRight size={18} />
              </motion.span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCartBar;

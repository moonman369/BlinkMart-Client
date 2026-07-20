import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { addToCart, optimisticAdjustQty, revertCart } from "../store/cartSlice";
import { showToast } from "../config/toastConfig";
import { cn } from "../util/cn";

/**
 * Cart stepper.
 *
 * Quantity changes are applied to the store immediately and reconciled with the
 * server afterwards, so taps register instantly instead of waiting on a
 * round-trip. If a request fails the pre-change snapshot is restored.
 */
const AddToCartButton = ({ product, cartItem, productDisplayPage }) => {
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items);

  // Rapid taps fire overlapping requests; only the newest response may write
  // to the store, otherwise a stale one can clobber a newer quantity.
  const requestSeq = useRef(0);

  const quantity = cartItem?.quantity || 0;

  const adjust = async (delta, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const snapshot = items;
    const seq = ++requestSeq.current;

    // 1. Optimistic: update the UI now.
    dispatch(optimisticAdjustQty({ product, delta }));

    if (delta > 0) {
      showToast.cart(product, { quantity: quantity + delta });
    }

    // 2. Reconcile with the server.
    try {
      setPending(true);

      const isAdd = delta > 0;
      const endpoint = isAdd
        ? apiSummary.endpoints.cart.addToCart
        : apiSummary.endpoints.cart.removeFromCart;

      const payload = isAdd
        ? { productId: product._id, quantity: 1 }
        : { cartProductId: cartItem?._id, quantity: 1 };

      const response = await customAxios.post(endpoint.path, payload);

      if (response.status === endpoint.successStatus) {
        if (seq === requestSeq.current) {
          dispatch(addToCart(response?.data?.data));
        }
      } else if (seq === requestSeq.current) {
        dispatch(revertCart(snapshot));
      }
    } catch (error) {
      if (seq === requestSeq.current) {
        dispatch(revertCart(snapshot));
      }
      axiosToastError(error);
    } finally {
      if (seq === requestSeq.current) setPending(false);
    }
  };

  // ---- Stepper (item already in cart) ----
  if (quantity > 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={(e) => e.preventDefault()}
        className={cn(
          "flex items-center justify-between overflow-hidden rounded-lg bg-mint-600 shadow-e1",
          productDisplayPage ? "h-12 w-full" : "h-8 w-[86px] lg:h-9 lg:w-24"
        )}
      >
        <button
          onClick={(e) => adjust(-1, e)}
          aria-label={`Remove one ${product?.name || "item"}`}
          className="flex h-full flex-1 items-center justify-center text-white transition-colors duration-fast active:bg-mint-700"
        >
          <FaMinus size={productDisplayPage ? 14 : 10} />
        </button>

        <div className="relative flex min-w-[26px] items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={quantity}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "block font-bold tabular-nums text-white",
                productDisplayPage ? "text-base" : "text-xs lg:text-sm"
              )}
            >
              {quantity}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={(e) => adjust(1, e)}
          disabled={product?.stock != null && quantity >= product.stock}
          aria-label={`Add one ${product?.name || "item"}`}
          className="flex h-full flex-1 items-center justify-center text-white transition-colors duration-fast active:bg-mint-700 disabled:opacity-40"
        >
          <FaPlus size={productDisplayPage ? 14 : 10} />
        </button>
      </motion.div>
    );
  }

  // ---- Full-width CTA on the product page ----
  if (productDisplayPage) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={(e) => adjust(1, e)}
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-mint-600 text-sm font-bold text-white shadow-e1 transition-colors duration-base hover:bg-mint-500 hover:shadow-glow-mint disabled:opacity-60"
      >
        <FiShoppingBag size={18} />
        Add to Cart
      </motion.button>
    );
  }

  // ---- Compact "Add" on cards ----
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={(e) => adjust(1, e)}
      disabled={pending}
      className="h-8 w-[86px] rounded-lg border border-mint-600/40 bg-mint-600/10 text-xs font-bold uppercase tracking-wide text-mint-400 transition-colors duration-base hover:bg-mint-600 hover:text-white lg:h-9 lg:w-24 lg:text-sm"
    >
      Add
    </motion.button>
  );
};

export default AddToCartButton;

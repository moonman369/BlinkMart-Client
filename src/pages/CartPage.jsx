import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiShoppingCart, FiTrash2, FiTruck } from "react-icons/fi";
import AddToCartButton from "../components/AddToCartButton";
import ClearCartModal from "../components/ClearCartModal";
import { getINRString } from "../util/getINRString";
import { getDiscountedPrice } from "../util/price";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { clearCart } from "../store/cartSlice";
import { showToast } from "../config/toastConfig";
import { DELIVERY_FEE } from "../util/constants";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const subtotal = cart.totalPrice || 0;
  // Delivery fee is unconditional, matching existing checkout behaviour.
  // (Checkout separately adds shipping + tax — see note in CartPage review.)
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // What the customer saved versus undiscounted prices
  const savings = cart.items.reduce((sum, item) => {
    const full = item?.product?.price || 0;
    const paid = getDiscountedPrice(full, item?.product?.discount);
    return sum + (full - paid) * (item?.quantity || 0);
  }, 0);

  const handleClearCart = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.cart.clearCart.path,
        method: apiSummary.endpoints.cart.clearCart.method,
      });

      if (
        response.status === apiSummary.endpoints.cart.clearCart.successStatus
      ) {
        dispatch(clearCart());
        showToast.success("Cart cleared");
        setShowClearCartModal(false);
      }
    } catch (error) {
      showToast.error("Failed to clear cart");
    }
  };

  const redirectToCheckout = () => {
    if (user?._id) {
      navigate("/checkout", {
        state: {
          from: "cart",
          user,
          cartItems: cart.items,
          totalAmount: total,
        },
      });
    } else {
      navigate("/login");
    }
  };

  if (!cart?.items?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-raised ring-1 ring-surface-border">
          <FiShoppingCart size={38} className="text-ink-faint" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-primary">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add items to get them delivered in 10 minutes.
          </p>
        </div>
        <Link
          to="/"
          className="pressable rounded-xl bg-mint-600 px-6 py-3 text-sm font-bold text-white shadow-e1 transition-colors hover:bg-mint-500"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="container mx-auto min-h-[calc(100vh-8rem)] px-3 py-4 lg:px-4 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Items */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h1 className="text-lg font-bold text-ink-primary lg:text-2xl">
                Your Cart
                <span className="ml-2 text-sm font-medium text-ink-muted">
                  {cart.totalQuantity}{" "}
                  {cart.totalQuantity === 1 ? "item" : "items"}
                </span>
              </h1>
              <button
                onClick={() => setShowClearCartModal(true)}
                className="pressable flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 lg:text-sm"
              >
                <FiTrash2 size={14} />
                Clear
              </button>
            </div>

            {/* Delivery ETA */}
            <div className="mb-4 flex items-center gap-2 rounded-card border border-surface-border bg-surface-raised px-3 py-2.5 text-xs">
              <FiTruck size={15} className="text-mint-400" />
              <span className="text-ink-secondary">
                Arriving in{" "}
                <span className="font-bold text-mint-400">10 minutes</span>
              </span>
            </div>

            <div className="space-y-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {cart.items.map((item) => {
                  const unitPrice = getDiscountedPrice(
                    item?.product?.price,
                    item?.product?.discount
                  );
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-3 rounded-card border border-surface-border bg-surface-raised p-3 transition-colors hover:border-surface-hover"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-hover/60 lg:h-20 lg:w-20">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-semibold text-ink-primary">
                            {item.product.name}
                          </h3>
                          <p className="text-2xs text-ink-muted lg:text-xs">
                            {item.product.unit}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-ink-primary lg:text-base">
                              {getINRString(unitPrice * item.quantity)}
                            </p>
                            {item?.product?.discount > 0 && (
                              <p className="text-2xs text-ink-faint line-through">
                                {getINRString(item.product.price * item.quantity)}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0">
                            <AddToCartButton
                              product={item.product}
                              cartItem={item}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:w-[340px] lg:shrink-0">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-card border border-surface-border bg-surface-raised p-4 lg:p-5">
                <h2 className="mb-4 text-base font-bold text-ink-primary">
                  Bill Details
                </h2>

                <dl className="space-y-2.5 text-sm">
                  <Row label="Item total" value={getINRString(subtotal)} />
                  <Row label="Delivery fee" value={getINRString(deliveryFee)} />
                  {savings > 0 && (
                    <Row
                      label="Savings"
                      value={
                        <span className="text-mint-400">
                          −{getINRString(savings)}
                        </span>
                      }
                    />
                  )}
                </dl>

                <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
                  <span className="text-sm font-bold text-ink-primary">
                    To Pay
                  </span>
                  <span className="text-lg font-extrabold tabular-nums text-ink-primary">
                    {getINRString(total)}
                  </span>
                </div>

                <button
                  onClick={redirectToCheckout}
                  className="pressable mt-4 w-full rounded-xl bg-mint-600 py-3.5 text-sm font-bold text-white shadow-e1 transition-colors hover:bg-mint-500 hover:shadow-glow-mint"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-3 text-center text-2xs text-ink-faint">
                  Prices are inclusive of all taxes
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ClearCartModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleClearCart}
      />
    </>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <dt className="text-ink-secondary">{label}</dt>
    <dd className="font-medium tabular-nums text-ink-primary">{value}</dd>
  </div>
);

export default CartPage;

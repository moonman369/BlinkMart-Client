import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";
import AddToCartButton from "../components/AddToCartButton";
import { getINRString } from "../util/getINRString";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { addToCart, clearCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import ClearCartModal from "../components/ClearCartModal";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const handleClearCart = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.cart.clearCart.path,
        method: apiSummary.endpoints.cart.clearCart.method,
      });

      if (response.status === apiSummary.endpoints.cart.clearCart.successStatus) {
        dispatch(clearCart());
        toast.success("Cart cleared successfully!");
        setShowClearCartModal(false);
      }
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 p-4">
        <TiShoppingCart size={100} className="text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8 min-h-[calc(100vh-8rem)] bg-gray-900/30">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full">
          {/* Scrollable Cart Items List */}
          <div className="flex-grow flex flex-col h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)] bg-gray-900/50 p-3 lg:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-2xl font-bold">
                Shopping Cart ({cart.totalQuantity} items)
              </h1>
              <button
                onClick={() => setShowClearCartModal(true)}
                className="flex items-center gap-1 lg:gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/30 transition-all duration-200"
              >
                <FaTrash size={14} />
                <span className="text-sm lg:text-base">Clear Cart</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto flex-grow pr-2 lg:pr-4 scrollbar-hide">
              <div className="space-y-3 lg:space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 lg:gap-4 bg-gray-800/80 p-3 lg:p-4 rounded-lg border border-gray-700 hover:border-gray-600"
                  >
                    <div className="bg-black/40 p-2 rounded-lg shrink-0">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-100 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-400">
                        {item.product.unit}
                      </p>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mt-2">
                        <p className="text-lg lg:text-xl font-bold text-green-500">
                          {getINRString(item.product.price)}
                        </p>
                        <div className="w-28 lg:w-32">
                          <AddToCartButton product={item.product} cartItem={item} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-28 lg:h-fit mt-4 lg:mt-0">
            <div className="bg-black/95 p-4 lg:p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-gray-800">
                <div className="p-1.5 lg:p-2 rounded-full bg-green-600/10">
                  <TiShoppingCart size={20} className="text-green-500" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-100">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                <div className="flex justify-between text-gray-300 bg-gray-800/40 p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    Subtotal
                  </span>
                  <span className="font-medium">
                    {getINRString(cart.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300 bg-gray-800/40 p-3 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    Delivery Fee
                  </span>
                  <span className="font-medium">{getINRString(40)}</span>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-gray-100 bg-gray-800/60 p-4 rounded-lg">
                    <span>Total Amount</span>
                    <span className="text-green-500 text-lg">
                      {getINRString(cart.totalPrice + 40)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 lg:py-4 px-4 rounded-lg">
                  <span className="text-sm lg:text-base">Proceed to Checkout</span>
                </button>
                <p className="text-center text-[10px] lg:text-xs text-gray-500">
                  Prices are inclusive of all taxes
                </p>
              </div>
            </div>
          </div>
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

export default CartPage;

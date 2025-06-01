import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";
import AddToCartButton from "../components/AddToCartButton";
import { getINRString } from "../util/getINRString";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { addToCart } from "../store/cartSlice";
import toast from "react-hot-toast";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleClearCart = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.cart.clearCart.path,
        method: apiSummary.endpoints.cart.clearCart.method,
      });

      if (
        response.status === apiSummary.endpoints.cart.clearCart.successStatus
      ) {
        dispatch(addToCart(null));
        toast.success("Cart cleared successfully!");
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
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)] bg-gray-900/30">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Scrollable Cart Items List */}
        <div className="flex-grow flex flex-col h-[calc(100vh-12rem)] bg-gray-900/50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Shopping Cart ({cart.totalQuantity} items)
            </h1>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <FaTrash /> Clear Cart
            </button>
          </div>

          {/* Scrollable Container with hidden scrollbar */}
          <div className="overflow-y-auto flex-grow pr-4 scrollbar-hide">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-gray-800/80 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg"
                >
                  <div className="bg-black/40 p-2 rounded-lg">
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.product.unit}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xl font-bold text-green-500">
                        {getINRString(item.product.price)}
                      </p>
                      <div className="w-32">
                        <AddToCartButton
                          product={item.product}
                          cartItem={item}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Static Checkout Section */}
        <div className="lg:w-1/3 lg:sticky lg:top-28 lg:h-fit">
          <div className="bg-black/95 p-6 rounded-lg border border-gray-800 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
              <div className="p-2 rounded-full bg-green-600/10">
                <TiShoppingCart size={24} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Order Summary</h2>
            </div>

            <div className="space-y-4 mb-6">
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

            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-green-900/20 hover:shadow-green-900/30 flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <span className="text-lg">→</span>
              </button>
              <p className="text-center text-xs text-gray-500">
                Prices are inclusive of all taxes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

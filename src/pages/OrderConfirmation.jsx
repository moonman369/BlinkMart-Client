import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getINRString } from "../util/getINRString";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
  FaArrowLeft,
  FaShoppingCart, // Added this icon
} from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { MdPayment } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
// Remove this problematic import
// import emptyCart from "../assets/empty-cart.svg";
import AddressCard from "../components/AddressCard";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  // If no order data is available, show empty state
  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        {/* Replace img with FaShoppingCart icon */}
        <div className="text-gray-600 mb-6">
          <FaShoppingCart size={80} className="opacity-50" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">
          No order information found
        </h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          It seems you've arrived here without completing an order. Please
          browse products and complete checkout.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md flex items-center gap-2"
        >
          <FaArrowLeft size={14} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  const { orderId, address, paymentMethod, cartItems, totalAmount } = orderData;

  return (
    <div className="container mx-auto px-2 lg:px-4 py-8 min-h-[calc(100vh-8rem)]">
      {/* Success Header */}
      <div className="bg-gray-900/50 border border-green-800/50 p-6 rounded-lg mb-6 flex flex-col items-center text-center">
        <div className="text-green-500 mb-4">
          <FaCheckCircle size={60} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-400 mb-2">
          Thank you for shopping with BlinkMart
        </p>
        <p className="bg-gray-800 px-4 py-2 rounded text-gray-300 font-mono">
          Order ID: <span className="font-semibold text-white">{orderId}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
              <div className="p-2 rounded-full bg-blue-900/20">
                <TiShoppingCart size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold">Order Summary</h2>
            </div>

            {/* Order Items List */}
            <div className="space-y-4 mb-6">
              {cartItems?.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 items-center border-b border-gray-800/50 pb-4"
                >
                  <div className="bg-gray-800 p-2 rounded w-16 h-16 shrink-0">
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-200">
                      {item.product.name}
                    </h3>
                    <div className="flex justify-between mt-1 text-sm text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>{getINRString(item.quantity * item.product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="space-y-2 bg-gray-800/40 p-4 rounded-lg">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{getINRString(totalAmount - 68)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping Fee</span>
                <span>{getINRString(50)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (GST)</span>
                <span>{getINRString(18)}</span>
              </div>
              <div className="flex justify-between font-semibold text-white pt-2 mt-2 border-t border-gray-700">
                <span>Total Amount</span>
                <span>{getINRString(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Side Panel */}
        <div className="lg:col-span-1">
          {/* Delivery Address */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
              <div className="p-2 rounded-full bg-green-900/20">
                <FaMapMarkerAlt size={16} className="text-green-500" />
              </div>
              <h2 className="font-semibold">Delivery Address</h2>
            </div>

            <div className="mb-2">
              <AddressCard
                address={address}
                showActions={false}
                showCheckoutButton={false}
              />
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
              <div className="p-2 rounded-full bg-purple-900/20">
                <MdPayment size={16} className="text-purple-500" />
              </div>
              <h2 className="font-semibold">Payment Information</h2>
            </div>

            <div className="text-gray-300 space-y-3">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span
                  className={`font-medium ${
                    paymentMethod === "COD"
                      ? "text-yellow-400"
                      : "text-green-500"
                  }`}
                >
                  {paymentMethod === "COD" ? "Pending" : "Paid"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
              <div className="p-2 rounded-full bg-blue-900/20">
                <FaBox size={16} className="text-blue-500" />
              </div>
              <h2 className="font-semibold">Order Status</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-green-500">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center"></div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-30">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <div>
                  <p className="font-medium">Shipped</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-20">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <div>
                  <p className="font-medium">Delivered</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-secondary-200 hover:bg-opacity-90 text-white rounded-lg font-semibold"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

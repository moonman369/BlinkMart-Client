import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import { FaArrowLeft, FaCreditCard, FaWallet } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa6";
import { getINRString } from "../util/getINRString";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};
  const user = useSelector((state) => state.user);

  // Get addresses from Redux store instead of using local state
  const addresses = useSelector((state) => state.addresses.addresses) || [];

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    // Redirect if no cart items
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Select default address if available, otherwise select first address
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [cartItems, navigate, addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);
    try {
      // Simulate order processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, make API call to create order

      toast.success("Order placed successfully!");
      navigate("/order-confirmation", {
        state: {
          orderId: "ORD" + Math.floor(100000 + Math.random() * 900000),
          address: selectedAddress,
          paymentMethod,
          cartItems,
          totalAmount,
        },
      });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
        >
          <FaArrowLeft size={14} />
          <span>Back</span>
        </button>
        <h1 className="text-xl lg:text-2xl font-bold">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left Column - Delivery Address & Payment */}
        <div className="flex-grow space-y-6">
          {/* Delivery Address */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
              Delivery Address
            </h2>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedAddress?._id === address._id
                        ? "border-primary-200 bg-gray-800/60"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {address.address_name || address.addressName}
                      </h3>
                      {(address.is_default || address.isDefault) && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 space-y-1">
                      <p>{address.address_line_1 || address.addressLine1}</p>
                      {(address.address_line_2 || address.addressLine2) && (
                        <p>{address.address_line_2 || address.addressLine2}</p>
                      )}
                      <p>
                        {address.city}, {address.state} -{" "}
                        {address.pincode || address.postalCode}
                      </p>
                      <p>Phone: {address.mobile}</p>
                    </div>
                  </div>
                ))}

                <button
                  className="border border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:text-gray-300 hover:border-gray-500"
                  onClick={() => navigate("/dashboard/addresses")}
                >
                  <span className="text-2xl mb-1">+</span>
                  <span>Add New Address</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">
                  You don't have any saved addresses yet.
                </p>
                <button
                  className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md"
                  onClick={() => navigate("/dashboard/addresses")}
                >
                  Add a New Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
              Payment Method
            </h2>

            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "card"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="p-2 rounded-full bg-blue-900/20">
                  <FaCreditCard className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Credit/Debit Card</h3>
                  <p className="text-xs text-gray-400">
                    Pay securely with your card
                  </p>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "upi"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="p-2 rounded-full bg-green-900/20">
                  <FaWallet className="text-green-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">UPI</h3>
                  <p className="text-xs text-gray-400">
                    Pay with UPI apps like GPay, PhonePe, Paytm
                  </p>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "netbanking"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("netbanking")}
              >
                <div className="p-2 rounded-full bg-purple-900/20">
                  <MdPayment className="text-purple-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Net Banking</h3>
                  <p className="text-xs text-gray-400">
                    Pay using your bank account
                  </p>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "cod"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="p-2 rounded-full bg-amber-900/20">
                  <FaMoneyBill className="text-amber-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Cash on Delivery</h3>
                  <p className="text-xs text-gray-400">
                    Pay when your order is delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-black/95 p-4 lg:p-6 rounded-lg border border-gray-800 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-gray-800">
              <div className="p-1.5 lg:p-2 rounded-full bg-green-600/10">
                <TiShoppingCart size={20} className="text-green-500" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-100">
                Order Summary
              </h2>
            </div>

            {/* Products Summary */}
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide pr-2 mb-4">
              {cartItems?.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <div className="bg-black/40 p-1 rounded w-12 h-12 shrink-0">
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium text-gray-300 truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>
                        {item.quantity} × {getINRString(item.product.price)}
                      </span>
                      <span>
                        {getINRString(item.quantity * item.product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <div className="flex justify-between text-gray-300 bg-gray-800/40 p-3 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Subtotal
                </span>
                <span className="font-semibold">
                  {getINRString(totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-gray-300 bg-gray-800/40 p-3 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Shipping Fee
                </span>
                <span className="font-semibold">{getINRString(50)}</span>
              </div>

              <div className="flex justify-between text-gray-300 bg-gray-800/40 p-3 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Tax (GST)
                </span>
                <span className="font-semibold">{getINRString(18)}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between text-xl font-bold text-gray-100 bg-gray-800/60 p-4 rounded-lg">
              <span>Total Amount</span>
              <span>{getINRString(totalAmount + 50 + 18)}</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
              className={`w-full mt-4 py-3 rounded-lg ${
                !selectedAddress
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-secondary-200 hover:bg-opacity-90"
              } text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-md`}
            >
              {loading ? (
                <LoadingSpinner size="4" color="white" />
              ) : (
                <>
                  <span>Place Order</span>
                  <TiShoppingCart size={20} />
                </>
              )}
            </button>

            {!selectedAddress && (
              <p className="text-xs text-red-400 mt-2 text-center">
                Please select a delivery address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

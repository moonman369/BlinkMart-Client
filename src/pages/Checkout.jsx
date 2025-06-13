import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
import { TiShoppingCart } from "react-icons/ti";
import { FaArrowLeft, FaCreditCard, FaWallet, FaPlus } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa6";
import { getINRString } from "../util/getINRString";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import AddressCard from "../components/AddressCard";
import { createCodOrder, createOnlineOrder } from "../util/orderMethods";
import { apiSummary } from "../config/api/apiSummary";
import { clearCart } from "../store/cartSlice"; // Import clearCart action
import customAxios from "../util/customAxios";
import { loadRazorpayScript } from "../util/razorPay";
import { paymentMethodsToRzpMap } from "../util/constants";
import { showToast } from "../config/toastConfig";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch hook
  const { cartItems, totalAmount } = location.state || {};

  // Get addresses from Redux store
  const addresses = useSelector((state) => state.addresses.addresses) || [];
  const user = useSelector((state) => state.user) || {};
  const RAZORPAY_KEY_ID = import.meta.env["VITE_APP_RAZORPAY_KEY_ID"];

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Set default to COD

  useEffect(() => {
    // Redirect if no cart items
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Select default address if available
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [cartItems, navigate, addresses]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handlePlaceCodOrder = async () => {
    if (!selectedAddress) {
      showToast.error("Please select a delivery address");
      return;
    }
    setLoading(true);
    try {
      const orderPayload = {
        deliveryAddressId: selectedAddress._id,
        paymentMethod: "COD",
        products: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        subtotalAmount: totalAmount,
        totalAmount: totalAmount + 50 + 18, // Including shipping and tax
      };

      const response = await createCodOrder(orderPayload);

      if (
        response.status ===
        apiSummary.endpoints.order.createCodOrder.successStatus
      ) {
        // Clear the cart after successful order
        await performClearCart();
        console.log(response);
        showToast.success("Order placed successfully!");
        navigate("/order-confirmation", {
          state: {
            orderId: response?.data?.data?.order_id,
            address: selectedAddress,
            paymentMethod: "COD",
            cartItems,
            totalAmount: totalAmount + 50 + 18, // Including shipping and tax
          },
        });
      }
    } catch (error) {
      showToast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOnlineOrder = async () => {
    if (!selectedAddress) {
      showToast.error("Please select a delivery address");
      return;
    }
    setLoading(true);
    try {
      const orderPayload = {
        deliveryAddressId: selectedAddress._id,
        paymentMethod: paymentMethod, // Changed from "COD" to "Online"
        products: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        subtotalAmount: totalAmount,
        totalAmount: totalAmount + 50 + 18, // Including shipping and tax
      };

      // Call the createOnlineOrder method instead of createCodOrder
      const response = await createOnlineOrder(orderPayload);

      if (
        response.status ===
        apiSummary.endpoints.order.createOnlineOrder.successStatus
      ) {
        // Get the payment URL from the response
        const { razorpayOrderId, amount } =
          response?.data?.data?.paymentDetails;
        console.log("Online", response);
        handlePayment(paymentMethod, razorpayOrderId, amount);
      }
    } catch (error) {
      showToast.error("Failed to process online payment. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const performClearCart = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.cart.clearCart.path,
        method: apiSummary.endpoints.cart.clearCart.method,
      });

      if (
        response.status === apiSummary.endpoints.cart.clearCart.successStatus
      ) {
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      showToast.error("Failed to clear cart");
    }
  };

  const handlePayment = async (paymentMethod, orderId, totalAmount) => {
    const res = await loadRazorpayScript();

    if (!res) {
      showToast.error("Razorpay SDK failed to load. Please try again later.");
      return;
    }

    // Get the correct RAZORPAY_KEY_ID
    const RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;

    if (!RAZORPAY_KEY_ID) {
      console.error("Razorpay key not found in environment variables");
      showToast.error("Payment configuration error. Please contact support.");
      return;
    }

    // Base options for all payment methods
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: "INR",
      name: "BlinkMart",
      description: "Order Payment",
      order_id: orderId,
      handler: async function (response) {
        showToast.success("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
        await handlePaymentSuccess(response);
      },
      prefill: {
        name: user?.username || "John Doe",
        email: user?.email || "john@example.com",
        contact: user?.mobile || "9876543210",
      },
      notes: {
        address: "BlinkMart",
        order_id: orderId,
      },
      theme: {
        color: "#00b050",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment cancelled by user");
          showToast.error("Payment cancelled");
        },
      },
    };

    // Map payment method to Razorpay's method names
    const paymentMethodMap = {
      Card: "card",
      UPI: "upi",
      "Net Banking": "netbanking",
    };

    // Apply the mapped method if it's not COD
    if (paymentMethod !== "COD" && paymentMethodMap[paymentMethod]) {
      options.method = paymentMethodMap[paymentMethod];

      // This is the key part: Configure specific payment method settings and hide others
      // These settings control which payment blocks are shown/hidden in the Razorpay modal
      options.config = {
        display: {
          blocks: {},
          sequence: [],
          preferences: {
            show_default_blocks: false,
          },
        },
      };

      // Only add the selected payment method block
      switch (paymentMethod) {
        case "Card":
          options.config.display.blocks.card = {
            name: "Pay with Card",
            instruments: [{ method: "card" }],
          };
          options.config.display.sequence = ["block.card"];
          break;

        case "UPI":
          options.config.display.blocks.upi = {
            name: "Pay using UPI",
            instruments: [
              {
                method: "upi",
                flow: "all",
                apps: ["google_pay", "phonepe", "paytm", "amazon_pay", "bhim"],
              },
            ],
          };
          options.config.display.sequence = ["block.upi"];
          break;

        case "Net Banking":
          options.config.display.blocks.netbanking = {
            name: "Pay via Net Banking",
            instruments: [{ method: "netbanking" }],
          };
          options.config.display.sequence = ["block.netbanking"];
          break;
      }
    }

    const rzp = new window.Razorpay(options);

    // Event handler for payment failure
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      showToast.error(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  };

  // Example frontend code
  const handlePaymentSuccess = async (response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    try {
      setLoading(true);
      const result = await customAxios.post("/api/v1/order/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (result.data.success) {
        // Clear the cart
        await performClearCart();

        // Show success message
        showToast.success("Payment verified successfully!");

        // Redirect to order confirmation page
        navigate("/order-confirmation", {
          state: {
            orderId: result.data.data.order_id, // Get order ID from the response
            address: selectedAddress,
            paymentMethod: paymentMethod,
            cartItems,
            totalAmount: totalAmount + 50 + 18, // Including shipping and tax
            paymentId: razorpay_payment_id,
            orderReference: razorpay_order_id,
          },
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      showToast.error("Payment verification failed. Please contact support.");

      // Navigate to orders page so they can see their order status
      navigate("/dashboard/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    // Update the selected payment method
    setPaymentMethod(method);

    // Additional logic based on payment method if needed
    switch (method) {
      case "COD":
        // Maybe show a message about COD
        console.log("Selected Cash on Delivery");
        break;
      case "Card":
        // Maybe prepare card form or validation
        console.log("Selected Card payment");
        break;
      case "UPI":
        // Maybe prepare UPI form or validation
        console.log("Selected UPI payment");
        break;
      case "Net Banking":
        // Maybe prepare bank selection options
        console.log("Selected Net Banking");
        break;
      default:
        console.log("Unknown payment method");
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
      {/* Header section */}
      <div className="flex items-center gap-2 mb-6">
        {/* Back button */}
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
        <div className="flex-grow space-y-6">
          {/* Delivery Address section with AddressCard */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
              Delivery Address
            </h2>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    isSelected={selectedAddress?._id === address._id}
                    onClick={handleSelectAddress}
                    showActions={false}
                    showCheckoutButton={false}
                  />
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

          {/* Payment Methods section */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
              Payment Method
            </h2>

            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "Card"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => handlePaymentMethodChange("Card")}
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
                  paymentMethod === "UPI"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => handlePaymentMethodChange("UPI")}
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
                  paymentMethod === "Net Banking"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => handlePaymentMethodChange("Net Banking")}
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
                  paymentMethod === "COD"
                    ? "border-primary-200 bg-gray-800/60"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => handlePaymentMethodChange("COD")}
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

        {/* Order Summary section */}
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
              onClick={
                paymentMethod === "COD"
                  ? handlePlaceCodOrder
                  : handlePlaceOnlineOrder
              }
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

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
      toast.error("Please select a delivery address");
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
        toast.success("Order placed successfully!");
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
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOnlineOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
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
      toast.error("Failed to process online payment. Please try again.");
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
      toast.error("Failed to clear cart");
    }
  };

  const handlePayment = async (paymentMethod, orderId, totalAmount) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Please try again later.");
      return;
    }

    const methodOptions = {
      card: { card: true, upi: false, netbanking: false },
      upi: { card: false, upi: true, netbanking: false },
      netbanking: { card: false, upi: false, netbanking: true },
    };

    console.log(RAZORPAY_KEY_ID);
    const options = {
      key: RAZORPAY_KEY_ID, // Replace with your Razorpay Test Key ID
      amount: totalAmount, // Already in paise
      currency: "INR",
      name: "My Store",
      description: "Order Payment",
      order_id: orderId, // 👈 From backend
      handler: async function (response) {
        // ✅ This function is called when payment is successful
        alert("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);

        // 🔐 (Optional) Call backend to verify signature
        // axios.post("/api/verify-payment", response);
        await handlePaymentSuccess(response);
      },
      prefill: {
        name: user?.username || "John Doe",
        email: user?.email || "john@example.com",
        contact: user?.mobile || "9876543210",
      },
      notes: {
        address: "BlinkMart",
      },
      theme: {
        color: "#3399cc",
      },
      method: methodOptions[paymentMethodsToRzpMap[paymentMethod]],
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Example frontend code
  const handlePaymentSuccess = async (response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    try {
      const result = await customAxios.post("/api/v1/order/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId: yourOrderId, // If needed
      });

      if (result.data.success) {
        // Show success message
        // Redirect to order confirmation page
      }
    } catch (error) {
      // Handle error
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

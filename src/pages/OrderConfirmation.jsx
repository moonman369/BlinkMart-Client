import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaArrowLeft,
  FaDownload,
  FaExclamationTriangle,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import { getINRString } from "../util/getINRString";
import customAxios from "../util/customAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import { showToast } from "../config/toastConfig";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Get order data from location state or fetch from API
  const [orderData, setOrderData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [retryLoading, setRetryLoading] = useState(false);

  // Extract paymentStatus from navigation state
  const paymentStatus = location.state?.paymentStatus || "Unknown";

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch order data if not available in location state
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!location.state) {
        try {
          setLoading(true);
          // Extract orderId from URL if present
          const pathSegments = location.pathname.split("/");
          const orderId = pathSegments[pathSegments.length - 1];

          if (orderId) {
            const response = await customAxios.get(`/api/v1/order/${orderId}`);
            if (response.data.success) {
              setOrderData(response.data.data);
            } else {
              navigate("/dashboard/my-orders");
            }
          } else {
            // No order ID in URL, redirect to orders
            navigate("/dashboard/my-orders");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          showToast.error("Failed to fetch order details");
          navigate("/dashboard/my-orders");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderData();
  }, [location, navigate]);

  // Replace retry logic: just navigate back to checkout with the same state
  const handleRetryPayment = () => {
    navigate("/checkout", { state: location.state });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="8" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaTimesCircle size={60} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-400 mb-6">
          We couldn't find the order details you're looking for.
        </p>
        <Link
          to="/dashboard/my-orders"
          className="bg-secondary-200 text-white px-6 py-2 rounded-lg inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto">
        {/* Status Header - Customized based on payment status */}
        <div
          className={`text-center p-6 rounded-lg mb-6 ${
            paymentStatus === "Completed"
              ? "bg-green-900/20 border border-green-800"
              : paymentStatus === "Failed"
              ? "bg-red-900/20 border border-red-800"
              : paymentStatus === "Cancelled"
              ? "bg-yellow-900/20 border border-yellow-800"
              : paymentStatus === "COD"
              ? "bg-purple-900/20 border border-purple-800" // <-- New color for COD
              : paymentStatus === "Pending" &&
                location.state?.paymentMethod === "COD"
              ? "bg-blue-900/20 border border-blue-800"
              : "bg-blue-900/20 border border-blue-800"
          }`}
        >
          {paymentStatus === "Completed" ? (
            <>
              <FaCheckCircle
                size={60}
                className="mx-auto text-green-500 mb-4"
              />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-300">
                Your order has been placed successfully. Thank you for shopping
                with us!
              </p>
            </>
          ) : paymentStatus === "Failed" ? (
            <>
              <FaTimesCircle size={60} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-300 mb-4">
                Your payment could not be processed. Don't worry, you can try
                again.
                {location.state?.errorDetails?.description && (
                  <span className="block mt-2 text-sm text-red-400">
                    Reason: {location.state.errorDetails.description}
                  </span>
                )}
              </p>
              <button
                onClick={handleRetryPayment}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg inline-flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" /> Retry Payment
              </button>
            </>
          ) : paymentStatus === "Cancelled" ? (
            <>
              <FaExclamationTriangle
                size={60}
                className="mx-auto text-yellow-500 mb-4"
              />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Payment Cancelled
              </h1>
              <p className="text-gray-300 mb-4">
                {location.state?.cancelReason ||
                  "You cancelled the payment process."}
                <span className="block mt-2">
                  You can retry payment or choose a different method.
                </span>
              </p>
              <button
                onClick={handleRetryPayment}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg inline-flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" /> Retry Payment
              </button>
            </>
          ) : paymentStatus === "COD" ? (
            <>
              <FaMoneyBillWave
                size={60}
                className="mx-auto text-purple-400 mb-4"
              />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Cash on Delivery Selected
              </h1>
              <p className="text-gray-300">
                Your order has been placed successfully. Please keep the cash
                ready at the time of delivery.
              </p>
            </>
          ) : paymentStatus === "Pending" &&
            location.state?.paymentMethod === "COD" ? (
            <>
              <LoadingSpinner size="12" className="mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Processing Payment
              </h1>
              <p className="text-gray-300">
                Please wait while we process your payment.
              </p>
            </>
          ) : (
            <>
              <LoadingSpinner size="12" className="mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Processing Payment
              </h1>
              <p className="text-gray-300">
                Please wait while we process your payment.
              </p>
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Order Details</h2>
            <span className="text-xs text-gray-400">
              {formatDate(orderData.orderDate)}
            </span>
          </div>

          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-400 text-sm mb-1">Order ID</p>
                <p className="font-mono">{orderData.orderId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                <p className="capitalize">{orderData.paymentMethod}</p>
              </div>
            </div>

            {(orderData.paymentId || orderData.orderReference) && (
              <div className="flex flex-col sm:flex-row justify-between mb-4 bg-gray-800/40 p-3 rounded-lg">
                {orderData.paymentId && (
                  <div className="mb-2 sm:mb-0">
                    <p className="text-gray-400 text-sm mb-1">Payment ID</p>
                    <p className="font-mono text-xs sm:text-sm truncate max-w-xs">
                      {orderData.paymentId}
                    </p>
                  </div>
                )}
                {orderData.orderReference && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Reference</p>
                    <p className="font-mono text-xs sm:text-sm truncate max-w-xs">
                      {orderData.orderReference}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-800/50">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    orderData.status === "Delivered"
                      ? "bg-green-500"
                      : orderData.status === "Shipped"
                      ? "bg-blue-500"
                      : orderData.status === "Cancelled"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span className="font-medium">
                  Status: {orderData.status || "Processing"}
                </span>
              </div>
              <div
                className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs ${
                  paymentStatus === "Completed"
                    ? "bg-green-900/20 text-green-500"
                    : paymentStatus === "Failed"
                    ? "bg-red-900/20 text-red-500"
                    : paymentStatus === "Cancelled"
                    ? "bg-yellow-900/20 text-yellow-500"
                    : "bg-blue-900/20 text-blue-500"
                }`}
              >
                Payment: {paymentStatus}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="py-4 border-b border-gray-800/50">
              <h3 className="font-medium mb-2 text-white">Delivery Address</h3>
              <div className="bg-gray-800/30 p-3 rounded">
                <p className="font-medium">
                  {orderData.address?.address_name || "Delivery Address"}
                </p>
                <p className="text-sm text-gray-400">
                  {orderData.address?.address_line_1}
                  {orderData.address?.address_line_2 &&
                    `, ${orderData.address.address_line_2}`}
                </p>
                <p className="text-sm text-gray-400">
                  {orderData.address?.city}, {orderData.address?.state},{" "}
                  {orderData.address?.pincode}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Phone: {orderData.address?.mobile}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="py-4">
              <h3 className="font-medium mb-3 text-white">Order Items</h3>
              <div className="space-y-3">
                {orderData.cartItems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 border-b border-gray-800/50 pb-3"
                  >
                    <div className="bg-gray-800 p-1 rounded w-16 h-16 shrink-0">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="font-medium text-gray-200 hover:text-secondary-200 text-sm truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Qty: {item.quantity}</span>
                        <span>{getINRString(item.product.price)} per unit</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {item.product.brand}
                        </span>
                        <span className="font-medium text-gray-300 text-sm">
                          {getINRString(item.quantity * item.product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="py-4 border-t border-gray-800">
              <h3 className="font-medium mb-3 text-white">Price Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items Total</span>
                  <span>{getINRString(orderData.totalAmount - 68)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Fee</span>
                  <span>{getINRString(50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (GST)</span>
                  <span>{getINRString(18)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 mt-2 border-t border-gray-800">
                  <span>Total Amount</span>
                  <span>{getINRString(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/dashboard/my-orders"
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-center"
          >
            View All Orders
          </Link>

          <Link
            to="/"
            className="flex-1 py-3 bg-secondary-200 hover:bg-opacity-90 text-white rounded-lg font-medium text-center flex items-center justify-center gap-2"
          >
            <FaShoppingCart size={16} />
            Continue Shopping
          </Link>

          {orderData.invoiceUrl && (
            <a
              href={orderData.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-lg font-medium text-center flex items-center justify-center gap-2"
            >
              <FaDownload size={16} />
              Download Invoice
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

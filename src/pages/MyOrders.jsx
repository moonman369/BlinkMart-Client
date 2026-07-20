import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaTruck, FaCheckCircle } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { getINRString } from "../util/getINRString";
import { getAllOrders } from "../util/orderMethods";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { apiSummary } from "../config/api/apiSummary";
import { showToast } from "../config/toastConfig";

const OrderStatusBadge = ({ status, paymentStatus }) => {
  const getStatusDetails = () => {
    switch (status) {
      case "Processing":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-400/20",
          borderColor: "border-blue-400/30",
          icon: <BsClockHistory className="text-blue-400" size={14} />,
        };
      case "Shipped":
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-400/20",
          borderColor: "border-amber-400/30",
          icon: <FaTruck className="text-amber-400" size={14} />,
        };
      case "Delivered":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/20",
          borderColor: "border-green-400/30",
          icon: <FaCheckCircle className="text-green-400" size={14} />,
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-400/20",
          borderColor: "border-gray-400/30",
          icon: <BsClockHistory className="text-gray-400" size={14} />,
        };
    }
  };

  const { color, bgColor, borderColor, icon } = getStatusDetails();
  return (
    <div
      className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${bgColor} ${borderColor} border`}
    >
      {icon}
      <span className={`text-2xs sm:text-xs font-medium ${color}`}>
        {status}
      </span>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();

      if (
        response.status ===
        apiSummary.endpoints.order.getAllOrders.successStatus
      ) {
        // Sort orders by date (most recent first)
        const sortedOrders = [...(response.data.data || [])].sort((a, b) => {
          // Convert string dates to Date objects and compare
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrders(sortedOrders);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again later.");
      showToast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update the formatDate function
  const formatDate = (dateString) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    // Format the date normally
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Add relative time info
    if (diffMinutes < 60) {
      return `${formattedDate} (${diffMinutes} min ago)`;
    } else if (diffHours < 24) {
      return `${formattedDate} (${diffHours} hrs ago)`;
    } else if (diffDays === 1) {
      return `${formattedDate} (yesterday)`;
    } else if (diffDays < 7) {
      return `${formattedDate} (${diffDays} days ago)`;
    }

    return formattedDate;
  };
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="6" className="sm:scale-125" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
        <FaBoxOpen size={48} className="sm:text-[60px] text-gray-600 mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-base">
          {error}
        </p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center justify-center text-center h-[60vh]">
          <FaBoxOpen size={48} className="sm:text-[60px] text-gray-600 mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-base px-4">
            You haven't placed any orders yet. Start shopping and your orders
            will appear here.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/view"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <FaArrowLeft size={12} className="sm:text-base" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold ml-1">
            My Orders
          </h1>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {orders.map((order, index) => {
          // Check if order is from the last 24 hours
          const isRecentOrder =
            new Date() - new Date(order.createdAt) < 24 * 60 * 60 * 1000;

          return (
            <div
              key={order._id}
              className={`bg-gray-900/50 rounded-lg border ${
                isRecentOrder ? "border-secondary-200/30" : "border-gray-800"
              } overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Order header */}{" "}
              <div className="flex flex-col bg-gray-800/50 px-3 py-3 sm:px-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">Order ID:</span>
                    <span className="text-xs sm:text-sm font-mono font-medium truncate max-w-[140px] sm:max-w-none">
                      {order.order_id}
                    </span>
                    {isRecentOrder && (
                      <span className="text-xs bg-secondary-200/20 text-secondary-200 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <OrderStatusBadge
                    status={order.status || "Processing"}
                    paymentStatus={order.payment_status}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Placed on:</span>
                  <span className="text-xs sm:text-sm">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-end mt-2">
                  <Link
                    to={`/dashboard/my-orders/${order.order_id}`}
                    state={{ orderData: order }}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>{" "}
              {/* Order items */}
              <div className="p-3 sm:p-4">
                <div className="grid gap-3 sm:gap-4">
                  {order.products.slice(0, 2).map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-2 sm:gap-3 items-center"
                    >
                      <div className="bg-gray-800 p-1 sm:p-1.5 rounded w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                        <img
                          src={
                            item?.product_id?.image?.[0] || "placeholder.jpg"
                          }
                          alt={item?.product_id?.name}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-300 truncate">
                          {item.product_id?.name}
                        </h4>
                        <div className="flex justify-between text-xs text-gray-400 mt-0.5 sm:mt-1">
                          <span>Qty: {item?.quantity}</span>
                          <span>{getINRString(item?.product_id?.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {order.products.length > 2 && (
                    <div className="text-2xs sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                      + {order.products.length - 2} more{" "}
                      {order.products.length - 2 === 1 ? "item" : "items"}
                    </div>
                  )}
                </div>{" "}
                {/* Order footer */}
                <div className="grid grid-cols-2 gap-x-2 mt-3 pt-3 border-t border-gray-800 sm:mt-4 sm:pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xs sm:text-xs text-gray-400">
                      Payment:
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                      <span className="text-xs sm:text-sm">
                        {order.payment_mode}
                      </span>
                      <span
                        className={`text-2xs sm:text-xs px-1.5 py-0.5 rounded inline-block w-fit ${
                          order.payment_status === "Pending"
                            ? "bg-amber-400/20 text-amber-400"
                            : order.payment_status === "Completed"
                            ? "bg-green-400/20 text-green-400"
                            : order.payment_status === "Failed"
                            ? "bg-red-400/20 text-red-400"
                            : order.payment_status === "Cancelled"
                            ? "bg-gray-400/20 text-gray-400"
                            : "bg-gray-400/20 text-gray-400"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xs sm:text-xs text-gray-400">
                      Order Total:
                    </span>
                    <span className="text-base sm:text-lg font-semibold">
                      {getINRString(order?.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaTruck, FaCheckCircle } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { getINRString } from "../util/getINRString";
import { getAllOrders } from "../util/orderMethods";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { apiSummary } from "../config/api/apiSummary";

const OrderStatusBadge = ({ status }) => {
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
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgColor} ${borderColor} border`}
    >
      {icon}
      <span className={`text-xs font-medium ${color}`}>{status}</span>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        console.log(response);
        setOrders(response.data.data || []);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again later.");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
        <FaBoxOpen size={60} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-400 mb-4 max-w-md">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
        <div className="flex items-center mb-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
          >
            <FaArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center text-center h-[60vh]">
          <FaBoxOpen size={60} className="text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-400 mb-4 max-w-md">
            You haven't placed any orders yet. Start shopping and your orders
            will appear here.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
          >
            <FaArrowLeft size={14} />
            <span>Back</span>
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold">My Orders</h1>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden"
          >
            {/* Order header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800/50 px-4 py-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Order ID:</span>
                  <span className="text-sm font-mono font-medium">
                    {order.order_id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Placed on:</span>
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <OrderStatusBadge status={order.status || "Processing"} />
                <Link
                  to={`/dashboard/orders/${order.order_id}`}
                  state={{ orderData: order }} // Pass the entire order object as state
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-gray-200"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Order items */}
            <div className="p-4">
              <div className="space-y-4">
                {order.products.slice(0, 2).map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="bg-gray-800 p-1.5 rounded w-12 h-12 shrink-0">
                      <img
                        src={item?.product_id?.image?.[0] || "placeholder.jpg"}
                        alt={item?.product_id?.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-medium text-gray-300 truncate">
                        {item.product?.name}
                      </h4>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Qty: {item?.quantity}</span>
                        <span>{getINRString(item?.product_id.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {order.products.length > 2 && (
                  <div className="text-xs text-gray-400 mt-2">
                    + {order.products.length - 2} more{" "}
                    {order.products.length - 2 === 1 ? "item" : "items"}
                  </div>
                )}
              </div>

              {/* Order footer */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-800">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">Payment:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">{order.payment_method}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        order.payment_method === "COD"
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-green-400/20 text-green-400"
                      }`}
                    >
                      {order.payment_method === "COD" ? "Pending" : "Paid"}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col items-end mt-2 md:mt-0">
                  <span className="text-xs text-gray-400">Order Total:</span>
                  <span className="text-lg font-semibold">
                    {getINRString(order?.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;

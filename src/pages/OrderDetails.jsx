import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaBox, 
  FaTruck, 
  FaCheckCircle 
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { BsClockHistory } from "react-icons/bs";
import { getINRString } from "../util/getINRString";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
        <FaBox size={60} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <p className="text-gray-400 mb-4 max-w-md">
          Order details are not available. Please go back to your orders list.
        </p>
        <button 
          onClick={() => navigate("/dashboard/my-orders")}
          className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate("/dashboard/my-orders")}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
        >
          <FaArrowLeft size={14} />
          <span>Back to Orders</span>
        </button>
        <h1 className="text-xl lg:text-2xl font-bold">Order Details</h1>
      </div>

      {/* Order Header Info */}
      <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-gray-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Order ID</span>
            <span className="font-mono font-medium">{order.order_id}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 md:mt-0">
            <span className="text-xs text-gray-400">Order Date</span>
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 md:mt-0">
            <span className="text-xs text-gray-400">Payment Method</span>
            <span className="font-medium">{order.payment_mode}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 md:mt-0">
            <span className="text-xs text-gray-400">Total Amount</span>
            <span className="font-medium text-lg">{getINRString(order.total_amount)}</span>
          </div>
        </div>

        {/* Order Status */}
        <div>
          <h3 className="font-medium mb-4">Order Status</h3>
          <div className="flex items-center gap-3 text-green-500 bg-gray-800/40 p-3 rounded-lg">
            {order.status === "Delivered" && <FaCheckCircle size={18} />}
            {order.status === "Shipped" && <FaTruck size={18} />}
            {order.status === "Processing" && <BsClockHistory size={18} />}
            {!order.status && <BsClockHistory size={18} />}
            
            <div className="flex-grow">
              <p className="font-medium">Status: {order.status || "Processing"}</p>
              <p className="text-xs text-gray-400">
                Last Updated: {formatDate(order.updatedAt)}
              </p>
            </div>

            {/* Payment Status Badge */}
            <div 
              className={`px-3 py-1.5 rounded-full text-sm ${
                order.payment_status === "Completed" 
                  ? "bg-green-900/30 text-green-500" 
                  : order.payment_status === "Failed"
                  ? "bg-red-900/30 text-red-500"
                  : "bg-yellow-900/30 text-yellow-500"
              }`}
            >
              Payment: {order.payment_status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
              <div className="p-2 rounded-full bg-blue-900/20">
                <TiShoppingCart size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-bold">Order Items</h2>
            </div>

            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item._id} className="flex gap-4 border-b border-gray-800/50 pb-4">
                  <div className="bg-gray-800 p-2 rounded w-16 h-16 shrink-0">
                    <img
                      src={item.product_id?.image?.[0] || "/placeholder.jpg"}
                      alt={item.product_id?.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link 
                      to={`/product/${item.product_id?._id}`} 
                      className="font-medium text-gray-200 hover:text-secondary-200"
                    >
                      {item.product_id?.name}
                    </Link>
                    <div className="flex justify-between mt-1 text-sm text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>{getINRString(item.product_id?.price)} per unit</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {item.product_id?.brand}
                      </span>
                      <span className="font-medium text-gray-300">
                        {getINRString(item.quantity * item.product_id?.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h3 className="font-medium mb-3">Price Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Items Total</span>
                  <span>{getINRString(order.sub_total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping Fee</span>
                  <span>{getINRString(50)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (GST)</span>
                  <span>{getINRString(18)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 mt-2 border-t border-gray-800">
                  <span>Total Amount</span>
                  <span>{getINRString(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Address */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
              <div className="p-2 rounded-full bg-green-900/20">
                <FaMapMarkerAlt size={16} className="text-green-500" />
              </div>
              <h2 className="font-bold">Delivery Address</h2>
            </div>

            <div className="space-y-2">
              <p className="font-medium">
                {order.delivery_address?.address_name || "Delivery Address"}
              </p>
              <p className="text-sm text-gray-400">
                {order.delivery_address?.address_line_1}
                {order.delivery_address?.address_line_2 && `, ${order.delivery_address?.address_line_2}`}
              </p>
              <p className="text-sm text-gray-400">
                {order.delivery_address?.city}, {order.delivery_address?.state}, {order.delivery_address?.pincode}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Phone: {order.delivery_address?.mobile}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
              <div className="p-2 rounded-full bg-purple-900/20">
                <MdPayment size={16} className="text-purple-500" />
              </div>
              <h2 className="font-bold">Payment Information</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-medium">{order.payment_mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status</span>
                <span className={`font-medium ${
                  order.payment_status === "Pending" ? "text-yellow-400" : 
                  order.payment_status === "Completed" ? "text-green-500" : "text-red-500"
                }`}>
                  {order.payment_status}
                </span>
              </div>
              {order.razorpay_order_id && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Reference</span>
                  <span className="font-mono text-xs">{order.razorpay_order_id.substring(0, 15)}...</span>
                </div>
              )}
              {order.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono text-xs">{order.razorpay_payment_id.substring(0, 15)}...</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/")} className="w-full py-2.5 bg-secondary-200 hover:bg-opacity-90 text-white rounded-lg font-medium">
              Continue Shopping
            </button>
            <button onClick={() => navigate("/dashboard/my-orders")} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">
              Back to My Orders
            </button>
            {order.invoice_receipt && (
              <a 
                href={order.invoice_receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span>Download Invoice</span>
              </a>
            )}
            <button 
              onClick={() => window.print()}
              className="w-full py-2.5 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <span>Print Order Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
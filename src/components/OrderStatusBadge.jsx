const OrderStatusBadge = ({ status, paymentStatus }) => {
  // For Order Status
  const getStatusDetails = () => {
    switch (status) {
      case "Processing":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-400/20",
          borderColor: "border-blue-400/30",
          icon: <BsClockHistory className="text-blue-400" size={14} />
        };
      case "Shipped":
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-400/20",
          borderColor: "border-amber-400/30",
          icon: <FaTruck className="text-amber-400" size={14} />
        };
      case "Delivered":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/20",
          borderColor: "border-green-400/30",
          icon: <FaCheckCircle className="text-green-400" size={14} />
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-400/20",
          borderColor: "border-gray-400/30",
          icon: <BsClockHistory className="text-gray-400" size={14} />
        };
    }
  };
  
  // For Payment Status
  const getPaymentStatusDetails = () => {
    switch (paymentStatus) {
      case "Completed":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/20",
          borderColor: "border-green-400/30"
        };
      case "Failed":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/20",
          borderColor: "border-red-400/30"
        };
      case "Pending":
      default:
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-400/20",
          borderColor: "border-amber-400/30"
        };
    }
  };

  const { color, bgColor, borderColor, icon } = getStatusDetails();
  const paymentDetails = getPaymentStatusDetails();

  return (
    <div className="flex gap-2">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgColor} ${borderColor} border`}>
        {icon}
        <span className={`text-xs font-medium ${color}`}>{status || "Processing"}</span>
      </div>
      {paymentStatus && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${paymentDetails.bgColor} ${paymentDetails.borderColor} border`}>
          <span className={`text-xs font-medium ${paymentDetails.color}`}>{paymentStatus}</span>
        </div>
      )}
    </div>
  );
};
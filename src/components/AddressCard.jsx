import React from "react";
import { FaHome, FaBuilding, FaTrash, FaEdit } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  showActions = true,
  showCheckoutButton = true,
  isSelected = false,
  onClick = null,
}) => {
  const navigate = useNavigate();

  const getIconAndColor = (type) => {
    switch (type) {
      case "Home":
        return {
          icon: <FaHome size={16} className="text-blue-400" />,
          bgColor: "bg-blue-900/20",
          dotColor: "bg-blue-500",
          textColor: "text-blue-400",
        };
      case "Work":
        return {
          icon: <FaBuilding size={16} className="text-amber-400" />,
          bgColor: "bg-amber-900/20",
          dotColor: "bg-amber-500",
          textColor: "text-amber-400",
        };
      default:
        return {
          icon: <MdLocationOn size={16} className="text-purple-400" />,
          bgColor: "bg-purple-900/20",
          dotColor: "bg-purple-500",
          textColor: "text-purple-400",
        };
    }
  };

  const { icon, bgColor, dotColor, textColor } = getIconAndColor(
    address.address_type
  );

  const cardClasses = onClick
    ? `cursor-pointer ${
        isSelected
          ? "border-primary-200 bg-gray-800/60"
          : "border-gray-700 hover:border-gray-600"
      }`
    : "border-gray-700";

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all duration-200 bg-gray-900/50 ${cardClasses}`}
      onClick={onClick ? () => onClick(address) : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {/* Icon based on address type */}
          <div className={`p-2 rounded-full ${bgColor}`}>{icon}</div>

          {/* Address content with improved layout */}
          <div className="flex-grow min-w-0">
            {/* Improved header section */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base truncate pr-2">
                  {address.address_name || "Unnamed Address"}
                </h3>

                {/* Address type badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}
                >
                  {address.address_type}
                </span>
              </div>

              {/* Default badge in a better position */}
              {address.is_default && (
                <div className="mt-1">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                </div>
              )}
            </div>

            {/* Address details */}
            <div className="text-sm text-gray-400 mt-2 space-y-1">
              <div className="line-clamp-1">{address.address_line_1}</div>
              {address.address_line_2 && (
                <div className="line-clamp-1">{address.address_line_2}</div>
              )}
              <div className="font-medium text-gray-300 mt-1">
                {address.city}, {address.state} - {address.pincode}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Phone: {address.mobile}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 bg-gray-800/50 rounded-md transition-colors"
              title="Edit address"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address._id);
              }}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 bg-gray-800/50 rounded-md transition-colors"
              title="Delete address"
            >
              <FaTrash size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Checkout button */}
      {showCheckoutButton && (
        <div className="flex justify-end mt-3 pt-2 border-t border-gray-800">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/checkout", {
                state: { selectedAddressId: address._id },
              });
            }}
            className="text-xs text-secondary-200 hover:text-secondary-100 bg-transparent"
          >
            Use for checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;

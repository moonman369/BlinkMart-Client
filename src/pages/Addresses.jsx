import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Add dispatch
import {
  FaArrowLeft,
  FaPlus,
  FaHome,
  FaBuilding,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import toast from "react-hot-toast";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import LoadingSpinner from "../components/LoadingSpinner";
import { axiosToastError } from "../util/axiosToastError";
import { fetchAllAddresses } from "../util/fetchAllAddresses";
import { setAddresses } from "../store/addressSlice"; // Import setAddresses action

const Addresses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch hook
  const user = useSelector((state) => state.user);

  // Get addresses from Redux store instead of local state
  const addresses = useSelector((state) => state.addresses.addresses) || [];
  console.log("Addresses:", addresses);

  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    addressName: "",
    addressType: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    mobile: "",
    isDefault: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [dispatch]); // Add dispatch to dependency array

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAddresses();

      if (
        response.status ===
        apiSummary.endpoints.address.getAllAddresses.successStatus
      ) {
        // Dispatch to Redux store instead of setting local state
        dispatch(setAddresses(response.data.data || []));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation remains the same
    if (
      !formData.addressName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.country ||
      !formData.mobile
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const endpoint = editMode
        ? `${apiSummary.endpoints.address.updateAddress.path}/${currentId}`
        : apiSummary.endpoints.address.addAddress.path;

      const method = editMode
        ? apiSummary.endpoints.address.updateAddress.method
        : apiSummary.endpoints.address.addAddress.method;

      const response = await customAxios({
        url: endpoint,
        method: method,
        data: formData,
      });

      if (
        response.status ===
        (editMode
          ? apiSummary.endpoints.address.updateAddress.successStatus
          : apiSummary.endpoints.address.addAddress.successStatus)
      ) {
        toast.success(
          editMode
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddForm(false);
        setEditMode(false);
        resetForm();
        fetchAddresses(); // This will now update the Redux store
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        editMode ? "Failed to update address" : "Failed to add address"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    // Update handleEdit function
    setFormData({
      addressName: address.addressName || address.address_name || "",
      addressType: address.addressType || address.address_type || "Home",
      addressLine1: address.addressLine1 || address.address_line_1 || "",
      addressLine2: address.addressLine2 || address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || address.pincode || "",
      country: address.country || "India",
      mobile: address.mobile || "",
      isDefault: address.isDefault || address.is_default || false,
    });
    setCurrentId(address._id);
    setEditMode(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await customAxios({
        url: `${apiSummary.endpoints.address.deleteAddress.path}/${id}`,
        method: apiSummary.endpoints.address.deleteAddress.method,
      });

      if (
        response.status ===
        apiSummary.endpoints.address.deleteAddress.successStatus
      ) {
        toast.success("Address deleted successfully");
        fetchAddresses(); // This will now update the Redux store
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Update resetForm function
    setFormData({
      addressName: "",
      addressType: "Home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      mobile: "",
      isDefault: false,
    });
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
          >
            <FaArrowLeft size={14} />
            <span>Back</span>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold">My Addresses</h1>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (editMode) {
              setEditMode(false);
              resetForm();
            }
          }}
          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg"
        >
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <FaPlus size={12} />
              <span>Add New</span>
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
            {editMode ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Address Name*
                </label>
                <input
                  type="text"
                  name="addressName"
                  placeholder="Home, Office, etc."
                  value={formData.addressName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Address Type*
                </label>
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200 appearance-none"
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Address Line 1*
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Street address, House no."
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Address Line 2{" "}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Apartment, Floor, Landmark, etc. (Optional)"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  City*
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  State*
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  PIN Code*
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="PIN Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>

              <div className="flex items-center h-full pt-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-secondary-200 rounded border-gray-700 bg-gray-800"
                  />
                  <span className="ml-2 text-gray-300">
                    Set as default address
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditMode(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-secondary-200 hover:bg-opacity-90 text-white rounded-md"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editMode
                  ? "Update Address"
                  : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address._id}
              className="p-4 bg-gray-900/50 border border-gray-700 hover:border-gray-600 rounded-lg shadow-sm transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {/* Icon based on addressType with distinct colors */}
                  <div
                    className={`p-2 rounded-full ${
                      address.address_type === "Home"
                        ? "bg-blue-900/20"
                        : address.address_type === "Work"
                        ? "bg-amber-900/20"
                        : "bg-purple-900/20"
                    }`}
                  >
                    {address.address_type === "Home" ? (
                      <FaHome size={16} className="text-blue-400" />
                    ) : address.address_type === "Work" ? (
                      <FaBuilding size={16} className="text-amber-400" />
                    ) : (
                      <MdLocationOn size={16} className="text-purple-400" />
                    )}
                  </div>

                  {/* Address content with more emphasis on name and location */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Address name with larger text */}
                      <h3 className="font-semibold text-base">
                        {address.address_name || "Unnamed Address"}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            address.address_type === "Home"
                              ? "bg-blue-500"
                              : address.address_type === "Work"
                              ? "bg-amber-500"
                              : "bg-purple-500"
                          }`}
                        ></span>
                        <span className="text-xs text-gray-400">
                          {address.address_type}
                        </span>
                      </div>
                      {address.is_default && (
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address details with enhanced location display */}
                    <div className="text-sm text-gray-400 mt-2 space-y-1">
                      <div className="line-clamp-1">
                        {address.address_line_1}
                      </div>
                      {address.address_line_1 && (
                        <div className="line-clamp-1">
                          {address.address_line_2}
                        </div>
                      )}
                      {/* Highlighted location info */}
                      <div className="font-medium text-gray-300 mt-1">
                        {address.city}, {address.state} - {address.pincode}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Phone: {address.mobile}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons with hover effects - Edit button now yellow */}
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 bg-gray-800/50 rounded-md transition-colors"
                    title="Edit address"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 bg-gray-800/50 rounded-md transition-colors"
                    title="Delete address"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex justify-end mt-3 pt-2 border-t border-gray-800">
                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: { selectedAddressId: address._id },
                    })
                  }
                  className="text-xs text-secondary-200 hover:text-secondary-100 bg-transparent"
                >
                  Use for checkout
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 bg-gray-900/50 border border-gray-700 rounded-lg flex flex-col items-center justify-center">
            <MdLocationOn size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400">No saved addresses found</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 flex items-center gap-1 bg-secondary-200 hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
            >
              <FaPlus size={12} />
              <span>Add Address</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;

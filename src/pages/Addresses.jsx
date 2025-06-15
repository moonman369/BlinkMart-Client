import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import toast from "react-hot-toast";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import LoadingSpinner from "../components/LoadingSpinner";
import { axiosToastError } from "../util/axiosToastError";
import { fetchAllAddresses } from "../util/fetchAllAddresses";
import { setAddresses } from "../store/addressSlice";
import AddressCard from "../components/AddressCard"; // Import the AddressCard component
import { showToast } from "../config/toastConfig";

const Addresses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Get addresses from Redux store
  const addresses = useSelector((state) => state.addresses.addresses) || [];

  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    addressName: "",
    addressType: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "", // Changed from postalCode
    country: "India",
    mobile: "",
    isDefault: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [dispatch]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAddresses();

      if (
        response.status ===
        apiSummary.endpoints.address.getAllAddresses.successStatus
      ) {
        dispatch(setAddresses(response.data.data || []));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showToast.error("Failed to load addresses");
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

    if (
      !formData.addressName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode || // Changed from postalCode
      !formData.country ||
      !formData.mobile
    ) {
      showToast.error("Please fill all required fields");
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
        showToast.success(
          editMode
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddForm(false);
        setEditMode(false);
        resetForm();
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast.error(
        editMode ? "Failed to update address" : "Failed to add address"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      addressName: address.addressName || address.address_name || "",
      addressType: address.addressType || address.address_type || "Home",
      addressLine1: address.addressLine1 || address.address_line_1 || "",
      addressLine2: address.addressLine2 || address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || address.postalCode || "", // Update field name but keep backward compatibility
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
        showToast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      addressName: "",
      addressType: "Home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "", // Changed from postalCode
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

      {/* Form section - unchanged */}
      {showAddForm && (
        <div className="bg-gray-900/50 p-4 lg:p-6 rounded-lg mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800">
            {editMode ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields remain the same */}
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
                  name="pincode"
                  placeholder="PIN Code"
                  value={formData.pincode}
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

      {/* Using AddressCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

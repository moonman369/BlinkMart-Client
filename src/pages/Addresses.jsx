import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
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

const Addresses = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await customAxios({
        url: apiSummary.endpoints.address.getAll.path,
        method: apiSummary.endpoints.address.getAll.method,
      });

      if (
        response.status === apiSummary.endpoints.address.getAll.successStatus
      ) {
        setAddresses(response.data.addresses || []);
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

    if (
      !formData.name ||
      !formData.addressLine ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const endpoint = editMode
        ? `${apiSummary.endpoints.address.update.path}/${currentId}`
        : apiSummary.endpoints.address.add.path;

      const method = editMode
        ? apiSummary.endpoints.address.update.method
        : apiSummary.endpoints.address.add.method;

      const response = await customAxios({
        url: endpoint,
        method: method,
        data: formData,
      });

      if (
        response.status ===
        (editMode
          ? apiSummary.endpoints.address.update.successStatus
          : apiSummary.endpoints.address.add.successStatus)
      ) {
        toast.success(
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
      toast.error(
        editMode ? "Failed to update address" : "Failed to add address"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setCurrentId(address._id);
    setEditMode(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await customAxios({
        url: `${apiSummary.endpoints.address.delete.path}/${id}`,
        method: apiSummary.endpoints.address.delete.method,
      });

      if (
        response.status === apiSummary.endpoints.address.delete.successStatus
      ) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
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
                  name="name"
                  placeholder="Home, Office, etc."
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:border-secondary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Full Address*
                </label>
                <input
                  type="text"
                  name="addressLine"
                  placeholder="Street address, House no."
                  value={formData.addressLine}
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
              className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gray-800 text-primary-200">
                    {address.name.toLowerCase().includes("home") ? (
                      <FaHome size={16} />
                    ) : address.name.toLowerCase().includes("office") ? (
                      <FaBuilding size={16} />
                    ) : (
                      <MdLocationOn size={16} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{address.name}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 space-y-1">
                      <p>{address.addressLine}</p>
                      <p>
                        {address.city}, {address.state}
                      </p>
                      <p>PIN: {address.pincode}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 bg-gray-800/50 rounded-md"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-gray-800/50 rounded-md"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
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

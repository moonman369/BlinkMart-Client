import React, { useState } from "react";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import LoadingSpinner from "./LoadingSpinner";

const AddToCartButton = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await customAxios.post(
        apiSummary.endpoints.cart.addToCart.path,
        {
          productId: product._id,
          quantity: 1,
        }
      );
      if (
        response.status === apiSummary.endpoints.cart.addToCart.successStatus
      ) {
        dispatch(addToCart(response?.data?.data));
        toast.success("Product added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      axiosToastError(error);
      toast.error("Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        className="bg-green-600 px-2 py-0.5 lg:px-4 lg:py-1 text-white rounded hover:bg-green-700 text-xs"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? <LoadingSpinner size={"5"} /> : "Add"}
      </button>
    </div>
  );
};

export default AddToCartButton;

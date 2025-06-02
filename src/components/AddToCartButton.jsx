import React, { useState } from "react";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import LoadingSpinner2 from "./LoadingSpinner2";

const AddToCartButton = ({ product, cartItem, productDisplayPage }) => {
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
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      axiosToastError(error);
      toast.error("Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (e) => {
    await handleAddToCart(e);
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await customAxios.post(
        apiSummary.endpoints.cart.removeFromCart.path,
        {
          cartProductId: cartItem._id,
          quantity: 1,
        }
      );
      if (
        response.status ===
        apiSummary.endpoints.cart.removeFromCart.successStatus
      ) {
        dispatch(addToCart(response?.data?.data));
        toast.success("Product removed from cart successfully!");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      axiosToastError(error);
      toast.error("Failed to remove product from cart");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {cartItem?.quantity > 0 ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className={`bg-green-600 hover:bg-green-700 text-white flex-1 w-full ${
              productDisplayPage ? "p-3" : "p-1"
            } rounded flex items-center justify-center`}
          >
            <FaMinus />
          </button>

          <div>
            {loading ? (
              <LoadingSpinner2 size={"5"} />
            ) : (
              <p
                className={`flex-1 w-full ${
                  productDisplayPage ? "px-2 py-3" : "px-1"
                } flex items-center justify-center ${
                  productDisplayPage ? "font-bold" : "font-semibold"
                }`}
              >
                {cartItem?.quantity}
              </p>
            )}
          </div>

          <button
            onClick={increaseQty}
            className={`bg-green-600 hover:bg-green-700 text-white flex-1 w-full ${
              productDisplayPage ? "p-3" : "p-1"
            } rounded flex items-center justify-center`}
          >
            <FaPlus />
          </button>
        </div>
      ) : productDisplayPage ? (
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      ) : (
        <button
          className="bg-green-600 px-2 py-1 lg:px-4 lg:py-1 text-white rounded hover:bg-green-700 text-sm"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? <LoadingSpinner2 size={"5"} /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;

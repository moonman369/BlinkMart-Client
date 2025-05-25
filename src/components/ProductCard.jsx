import React from "react";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { data, Link } from "react-router-dom";
// import { valideURLConvert } from "../utils/valideURLConvert";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { axiosToastError } from "../util/axiosToastError";
import toast from "react-hot-toast";
import { useState } from "react";
import { apiSummary } from "../config/api/apiSummary";
import { getINRString } from "../util/getINRString.js";
import { convertToUrlString } from "../util/convertToUrlString.js";
import customAxios from "../util/customAxios.js";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const url = `/product/${convertToUrlString(product?.name)}-${product._id}`;
  // console.log("product", product);

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
    <Link
      to={url}
      state={{
        productId: product._id,
      }}
      className="border hover:border-secondary-200 p-2 lg:p-4 grid gap-0.5 lg:gap-3 max-w-32 lg:max-w-64 rounded cursor-pointer bg-gray-700"
    >
      <div className="min-h-20 max-h-28 rounded">
        <img
          src={product.image[0]}
          className="object-scale-down scale-75 lg:scale-105 overflow-hidden h-full w-full rounded"
          loading="lazy"
        />
      </div>
      <div className="bg-[#2e482e] text-green-500 rounded px-1 text-[10px] lg:text-sm w-fit">
        10 min
      </div>
      <div className="font-medium text-ellipsis line-clamp-2 text-xs lg:text-base">
        {product.name}
      </div>
      <div className="w-fit text-gray-400 text-[10px] lg:text-sm">
        {product.unit}
      </div>

      <div className="flex items-center justify-between gap-1 lg:gap-3">
        <div className="bg-gray-600 rounded w-16 text-secondary-200 font-bold p-1 lg:p-2 text-xs">
          {getINRString(product.price)}
        </div>
        <div className="bg-green-600 px-2 py-0.5 lg:px-4 lg:py-1 text-white rounded hover:bg-green-700 text-xs" onClick={handleAddToCart}>
          <button>Add</button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

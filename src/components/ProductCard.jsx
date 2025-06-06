import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice.js";
import AddToCartButton from "./AddToCartButton.jsx";
import { FaMinus, FaPlus } from "react-icons/fa6";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const cartItems = useSelector((state) => state.cart?.items);

  const url = `/product/${convertToUrlString(product?.name)}-${product._id}`;
  const dispatch = useDispatch();
  // console.log("product", product);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const item = cartItems.find((item) => item.product._id === product._id);
      if (item) {
        setCartItem(item);
      } else {
        setCartItem({});
      }
    } else {
      setCartItem({});
    }
  }, [cartItems]);

  return (
    <Link
      to={url}
      state={{
        productId: product._id,
      }}
      className="border hover:border-secondary-200 p-2 lg:p-4 grid gap-0.5 lg:gap-3 max-w-44 lg:max-w-72 rounded cursor-pointer bg-gray-700"
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
        <div>
          {product.stock > 0 ? (
            <AddToCartButton product={product} cartItem={cartItem} />
          ) : (
            <button
              className="bg-gray-600 px-2 py-0.5 lg:px-4 lg:py-1 text-white rounded cursor-not-allowed text-xs"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

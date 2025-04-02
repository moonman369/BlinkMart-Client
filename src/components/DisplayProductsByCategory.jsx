import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosToastError } from "../util/axiosToastError.js";
import { fetchProductsByCategory } from "../util/fetchAllProducts.js";
import { apiSummary } from "../config/api/apiSummary.js";
import CardLoading from "./CardLoading.jsx";
import ProductCard from "./ProductCard.jsx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const DisplayProductsByCategory = ({ id, name }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProductsByCategory = async () => {
    setLoading(true);
    try {
      const productResponse = await fetchProductsByCategory({
        categoryId: id,
        pageSize: 20,
        currentPage: 1,
      });

      if (
        productResponse.status ===
        apiSummary.endpoints.product.getProductsByCategory.successStatus
      ) {
        setProducts(productResponse.data.data);
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProductsByCategory();
  }, []);

  const loadingCardCount = new Array(6).fill(null);
  return (
    <div className="p-5">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg md:text-xl">{name}</h3>
        <Link to="/" className="text-green-700 hover:text-secondary-200">
          See All
        </Link>
      </div>
      <div className="flex items-center gap-4 md:gap-6 lg:gap-10 mx-auto px-4 overflow-hidden">
        {loading &&
          loadingCardCount.map((_, i) => {
            return <CardLoading key={`Prod-Loading-${i}`} />;
          })}
        {products.map((product, i) => {
          return (
            <ProductCard key={`${product._id}-Prod-${i}`} product={product} />
          );
        })}
        <div className="w-full absolute hidden px-4 lg:flex justify-between left-0 right-0 container mx-auto">
          <button className="z-10 relative bg-black rounded-full p-2 shadow-sm shadow-primary-200 bg-opacity-45 hover:bg-opacity-100 text-lg">
            <FaAngleLeft />
          </button>
          <button className="z-10 relative bg-black rounded-full p-2 shadow-sm shadow-primary-200 bg-opacity-45 hover:bg-opacity-100 text-lg">
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayProductsByCategory;

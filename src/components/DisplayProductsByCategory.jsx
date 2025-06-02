import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { axiosToastError } from "../util/axiosToastError.js";
import { fetchProductsByCategory } from "../util/fetchAllProducts.js";
import { apiSummary } from "../config/api/apiSummary.js";
import CardLoading from "./CardLoading.jsx";
import ProductCard from "./ProductCard.jsx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const DisplayProductsByCategory = ({
  id,
  name,
  category,
  handleRedirectToCategoryPage,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
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

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const loadingCardCount = new Array(6).fill(null);
  return products.length > 0 ? (
    <div className="p-5">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg md:text-xl">{name}</h3>
        <div
          className="text-green-700 hover:text-secondary-200 cursor-pointer"
          onClick={() => {
            handleRedirectToCategoryPage(category);
          }}
        >
          See All
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        <div
          ref={containerRef}
          className="flex gap-4 md:gap-6 lg:gap-10 mx-auto overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {loading &&
            loadingCardCount.map((_, i) => {
              return <CardLoading key={`Prod-Loading-${i}`} />;
            })}
          {products.map((product, i) => {
            return (
              <ProductCard key={`${product._id}-Prod-${i}`} product={product} />
            );
          })}
        </div>
        <div className="w-full absolute hidden px-4 lg:flex justify-between left-0 right-0 container mx-auto pointer-events-none">
          <button
            className="pointer-events-auto z-10 relative bg-black rounded-full p-2 shadow-sm shadow-primary-200 bg-opacity-45 hover:bg-opacity-100 text-lg"
            onClick={handleScrollLeft}
          >
            <FaAngleLeft />
          </button>
          <button
            className="pointer-events-auto z-10 relative bg-black rounded-full p-2 shadow-sm shadow-primary-200 bg-opacity-45 hover:bg-opacity-100 text-lg"
            onClick={handleScrollRight}
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="p-5">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg md:text-xl">{name}</h3>
      </div>
      <div className="flex items-center justify-center h-64">
        {loading ? (
          <CardLoading />
        ) : (
          <p className="text-gray-500">
            No products available in this category
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplayProductsByCategory;

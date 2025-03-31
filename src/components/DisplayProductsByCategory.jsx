import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosToastError } from "../util/axiosToastError.js";
import { fetchProductsByCategory } from "../util/fetchAllProducts.js";
import { apiSummary } from "../config/api/apiSummary.js";

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
      //   console.log(productResponse);
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

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg md:text-xl">{name}</h3>
        <Link to="/" className="text-green-700 hover:text-secondary-200">
          See All
        </Link>
      </div>
      <div></div>
    </div>
  );
};

export default DisplayProductsByCategory;

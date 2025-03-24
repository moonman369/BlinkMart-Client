import { AxiosError } from "axios";
import React, { useState } from "react";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";

const Products = () => {
  const [productData, setProductData] = useState([]);

  const fetchProductData = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.product.getProducts.path,
        method: apiSummary.endpoints.product.getProducts.method,
        params: {
          currentPage: currentPage ?? 1,
          pageSize: pageSize ?? 20,
        },
      });

      if (
        response.status ==
        apiSummary.endpoints.product.getProducts.successStatus
      ) {
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };

  return <div>Products</div>;
};

export default Products;

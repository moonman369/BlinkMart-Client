import { AxiosError } from "axios";
import React, { useState } from "react";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";

const Products = () => {
  const [productData, setProductData] = useState([]);

  return <div>Products</div>;
};

export default Products;

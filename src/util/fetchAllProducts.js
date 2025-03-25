import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const fetchAllProducts = async ({ all, currentPage, pageSize }) => {
  if (all) {
    const productResponse = await customAxios({
      url: apiSummary.endpoints.product.getProducts.path,
      method: apiSummary.endpoints.product.getProducts.method,
      params: {
        all: true,
      },
    });
    return productResponse;
  }

  const productResponse = await customAxios({
    url: apiSummary.endpoints.product.getProducts.path,
    method: apiSummary.endpoints.product.getProducts.method,
    params: {
      currentPage: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    },
  });
  // console.log(productResponse);
  return productResponse;
};

import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const fetchAllProducts = async ({
  all,
  currentPage,
  pageSize,
  searchText,
}) => {
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
      ...(searchText && { search: searchText }),
    },
  });
  // console.log(productResponse);
  return productResponse;
};

export const fetchProductsByCategory = async ({
  all,
  currentPage,
  pageSize,
  categoryId,
}) => {
  if (all) {
    const productResponse = await customAxios({
      url: apiSummary.endpoints.product.getProductsByCategory.path,
      method: apiSummary.endpoints.product.getProductsByCategory.method,
      params: {
        categoryId: categoryId,
        all: true,
      },
    });
    return productResponse;
  }

  const productResponse = await customAxios({
    url: apiSummary.endpoints.product.getProductsByCategory.path,
    method: apiSummary.endpoints.product.getProductsByCategory.method,
    params: {
      categoryId: categoryId,
      currentPage: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    },
  });
  // console.log(productResponse);
  return productResponse;
};

export const fetchProductsBySubcategory = async ({
  all,
  currentPage,
  pageSize,
  subcategoryId,
}) => {
  if (all) {
    const productResponse = await customAxios({
      url: apiSummary.endpoints.product.getProductsBySubategory.path,
      method: apiSummary.endpoints.product.getProductsBySubategory.method,
      params: {
        subcategoryId: subcategoryId,
        all: true,
      },
    });
    return productResponse;
  }

  const productResponse = await customAxios({
    url: apiSummary.endpoints.product.getProductsBySubategory.path,
    method: apiSummary.endpoints.product.getProductsBySubategory.method,
    params: {
      subcategoryId: subcategoryId,
      currentPage: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    },
  });
  // console.log(productResponse);
  return productResponse;
};

import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";
import logger from "./logger";

export const fetchAllSubcategories = async ({ all, currentPage, pageSize }) => {
  if (all) {
    const subcategoryResponse = await customAxios({
      url: apiSummary.endpoints.subcategory.getAllSubcategories.path,
      method: apiSummary.endpoints.subcategory.getAllSubcategories.method,
      params: {
        all: true,
      },
    });
    return subcategoryResponse;
  }

  const subcategoryResponse = await customAxios({
    url: apiSummary.endpoints.subcategory.getAllSubcategories.path,
    method: apiSummary.endpoints.subcategory.getAllSubcategories.method,
    params: {
      currentPage: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    },
  });
  // logger.log(subcategoryResponse);
  return subcategoryResponse;
};

export const fetchSubcategoriesByCategory = async ({ categoryId, all, currentPage, pageSize }) => {
  if (all) {
    const subcategoryResponse = await customAxios({
      url: apiSummary.endpoints.subcategory.getSubcategoriesByCategory.path,
      method: apiSummary.endpoints.subcategory.getSubcategoriesByCategory.method,
      params: {
        categoryId,
        all: true,
      },
    });
    return subcategoryResponse;
  }

  const subcategoryResponse = await customAxios({
    url: apiSummary.endpoints.subcategory.getSubcategoriesByCategory.path,
    method: apiSummary.endpoints.subcategory.getSubcategoriesByCategory.method,
    params: {
      categoryId,
      currentPage: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    },
  });
  return subcategoryResponse;
};

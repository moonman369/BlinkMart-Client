import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

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
  // console.log(subcategoryResponse);
  return subcategoryResponse;
};

import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const fetchAllCategories = async () => {
  const fetchCategoriesResponse = await customAxios({
    url: apiSummary.endpoints.category.getAllCategories.path,
    method: apiSummary.endpoints.category.getAllCategories.method,
    params: {
      currentPage: 1,
      pageSize: 20,
    },
  });
  console.log(fetchCategoriesResponse);
  return fetchCategoriesResponse;
};

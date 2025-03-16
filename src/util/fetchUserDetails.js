import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const fetchUserDetails = async () => {
  try {
    const response = await customAxios({
      url: apiSummary.endpoints.user.getUserDetails.path,
      method: apiSummary.endpoints.user.getUserDetails.method,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

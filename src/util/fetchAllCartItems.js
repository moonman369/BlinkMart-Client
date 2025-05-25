import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const fetchAllCartItems = async () => {
  const cartResponse = await customAxios({
    url: apiSummary.endpoints.cart.getCart.path,
    method: apiSummary.endpoints.cart.getCart.method,
  });
  return cartResponse;
};

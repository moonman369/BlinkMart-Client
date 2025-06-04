import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";
/**
 * Fetches all addresses from the server.
 * @returns {Promise} A promise that resolves to the response containing all addresses.
 */
export const fetchAllAddresses = async () => {
  const addressesResponse = await customAxios({
    url: apiSummary.endpoints.address.getAllAddresses.path,
    method: apiSummary.endpoints.address.getAllAddresses.method,
  });
  return addressesResponse;
};

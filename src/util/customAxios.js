import axios from "axios";
import { apiSummary } from "../config/api/apiSummary";

export const customAxios = axios.create({
  baseURL: apiSummary.baseUrl,
  withCredentials: true,
});

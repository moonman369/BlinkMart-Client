import { apiSummary } from "../config/api/apiSummary";
import customAxios from "./customAxios";

export const getAllOrders = () => {
  const ordersResponse = customAxios({
    url: apiSummary.endpoints.order.getAllOrders.path,
    method: apiSummary.endpoints.order.getAllOrders.method,
  });

  return ordersResponse;
};

export const createCodOrder = (orderDetails) => {
  const codOrderResponse = customAxios({
    url: apiSummary.endpoints.order.createCodOrder.path,
    method: apiSummary.endpoints.order.createCodOrder.method,
    data: orderDetails,
  });

  return codOrderResponse;
};

export const getOrderById = (orderId) => {
  const orderResponse = customAxios({
    url: `${apiSummary.endpoints.order.getOrderById.path}/${orderId}`,
    method: apiSummary.endpoints.order.getOrderById.method,
  });

  return orderResponse;
};

export const createOnlineOrder = (orderDetails) => {
  const onlineOrderResponse = customAxios({
    url: apiSummary.endpoints.order.createOnlineOrder.path,
    method: apiSummary.endpoints.order.createOnlineOrder.method,
    data: orderDetails,
  });

  return onlineOrderResponse;
};

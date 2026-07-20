import { getINRString } from "./getINRString";

/** Price after applying a percentage discount. */
export const getDiscountedPrice = (price = 0, discount = 0) =>
  discount > 0 ? (price * (100 - discount)) / 100 : price;

/** Formatted effective price, discount applied. */
export const getDiscountedPriceString = (price = 0, discount = 0) =>
  getINRString(getDiscountedPrice(price, discount));

export { getINRString };

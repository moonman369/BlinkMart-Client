import { convertToUrlString } from "./convertToUrlString";

/**
 * Builds the canonical path for the categorized-products page.
 *
 * Must stay in sync with the route defined in src/routes/index.jsx
 * ("product-categorized/:category" -> ":subcategory"). Centralised because the
 * segment was previously hand-built at each call site and drifted.
 */
export const buildProductCategorizedUrl = (category, subcategory) =>
  `/product-categorized/${convertToUrlString(category?.name)}-${
    category?._id
  }/${convertToUrlString(subcategory?.name)}-${subcategory?._id}`;

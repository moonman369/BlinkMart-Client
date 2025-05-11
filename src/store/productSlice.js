import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  allCategories: [],
  loadingCategory: false,
  allSubcategories: [], // For home page view
  paginatedSubcategories: [], // For admin table view
  allProducts: [],
  pageDetails: {
    categories: {},
    subcategories: {},
    products: {},
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategories: (state, action) => {
      state.allCategories = [...action.payload];
    },
    setCategoryPageDetails: (state, action) => {
      state.pageDetails.categories = { ...action.payload };
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },

    setAllSubcategories: (state, action) => {
      state.allSubcategories = [...action.payload];
    },
    setPaginatedSubcategories: (state, action) => {
      state.paginatedSubcategories = [...action.payload];
    },
    setSubcategoryPageDetails: (state, action) => {
      state.pageDetails.subcategories = { ...action.payload };
    },

    setAllProducts: (state, action) => {
      state.allProducts = [...action.payload];
    },
    setProductPageDetails: (state, action) => {
      state.pageDetails.products = { ...action.payload };
    },
  },
});

export const {
  setAllCategories,
  setAllSubcategories,
  setPaginatedSubcategories,
  setLoadingCategory,
  setAllProducts,
  setCategoryPageDetails,
  setSubcategoryPageDetails,
  setProductPageDetails,
} = productSlice.actions;

export default productSlice.reducer;

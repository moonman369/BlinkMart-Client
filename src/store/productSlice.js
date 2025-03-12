import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategories: [],
  allSubcategories: [],
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

    setAllSubcategories: (state, action) => {
      state.allSubcategories = [...action.payload];
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
  setAllProducts,
  setCategoryPageDetails,
  setSubcategoryPageDetails,
  setProductPageDetails,
} = productSlice.actions;

export default productSlice.reducer;

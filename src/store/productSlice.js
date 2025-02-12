import { createSlice } from "@reduxjs/toolkit";
import { all } from "axios";

const initialState = {
  allCategories: [],
  allSubcategories: [],
  allProducts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategories: (state, action) => {
      state.allCategories = [...action.payload];
    },
    setAllSubcategories: (state, action) => {
      state.allSubcategories = [...action.payload];
    },
    setAllProducts: (state, action) => {
      state.allProducts = [...action.payload];
    },
  },
});

export const { setAllCategories, setAllSubcategories, setAllProducts } =
  productSlice.actions;

export default productSlice.reducer;

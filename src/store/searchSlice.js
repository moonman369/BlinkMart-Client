import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  recentSearches: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addRecentSearch: (state, action) => {
      const query = action.payload;
      if (query.trim()) {
        state.recentSearches = [
          query,
          ...state.recentSearches.filter((s) => s !== query),
        ].slice(0, 5);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const { setSearchQuery, addRecentSearch, clearRecentSearches } =
  searchSlice.actions;

export default searchSlice.reducer;

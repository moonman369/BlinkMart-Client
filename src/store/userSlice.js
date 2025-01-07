import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state = { ...action.payload };
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  email: "",
  avatar: "",
  mobile: "",
  email_is_verified: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  order_history: [],
  role: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.username = action.payload?.username;
      state.email = action.payload?.email;
      state.avatar = action.payload?.avatar;
      state.mobile = action.payload?.mobile;
      state.email_is_verified = action.payload?.email_is_verified;
      state.last_login_date = action.payload?.last_login_date;
      state.status = action.payload?.status;
      state.address_details = action.payload?.address_details;
      state.shopping_cart = action.payload?.shopping_cart;
      state.order_history = action.payload?.order_history;
      state.role = action.payload?.role;
      state.createdAt = action.payload?.createdAt;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload?.avatar;
    },
    resetUserDetails: (state, action) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.avatar = "";
      state.mobile = "";
      state.email_is_verified = "";
      state.last_login_date = "";
      state.status = "";
      state.address_details = [];
      state.shopping_cart = [];
      state.order_history = [];
      state.role = "";
      state.createdAt = "";
    },
  },
});

export const { setUserDetails, resetUserDetails, updateAvatar } =
  userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const cartResponseItems = action.payload;
      console.log("item", cartResponseItems);

      let [totalQuantity, totalPrice] = [0, 0];
      cartResponseItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalPrice += item?.product?.price * item.quantity;
      });
      state.items = cartResponseItems;
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((i) => i.id === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

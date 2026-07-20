import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

/** Totals are always derived from items so the two can't drift apart. */
const recalculate = (state) => {
  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Reconciles local state with the authoritative server cart. */
    addToCart(state, action) {
      state.items = action.payload || [];
      recalculate(state);
    },

    /**
     * Applies a quantity change immediately, before the network call resolves.
     * Without this the stepper waits on a round-trip and feels sluggish.
     *
     * Items added optimistically carry `_optimistic: true` and a temporary id;
     * the follow-up `addToCart` from the server response replaces them.
     */
    optimisticAdjustQty(state, action) {
      const { product, delta } = action.payload;
      const existing = state.items.find(
        (item) => item?.product?._id === product._id
      );

      if (existing) {
        existing.quantity += delta;
        if (existing.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item?.product?._id !== product._id
          );
        }
      } else if (delta > 0) {
        state.items.push({
          _id: `optimistic-${product._id}`,
          product,
          quantity: delta,
          _optimistic: true,
        });
      }

      recalculate(state);
    },

    /** Restores a snapshot captured before an optimistic update failed. */
    revertCart(state, action) {
      state.items = action.payload || [];
      recalculate(state);
    },

    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item?.product?._id !== productId
      );
      recalculate(state);
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  optimisticAdjustQty,
  revertCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/Basket";

interface BasketState {
  basket: Basket | null;
}

const initialState: BasketState = {
  basket: null,
};

export const basketSlice = createSlice({
  // To identify the slice
  name: "basket",
  // Initial state value
  initialState,
  // Reducers functions to define how state can be updated
  reducers: {
    setBasket: (state, action: PayloadAction<Basket>) => {
      state.basket = action.payload;
    },
    // Remove item from the basket
    removeItem: (state, acton) => {
      const { productId, quantity } = acton.payload;
      // Find the item index in the items collection
      const itemIndex = state.basket?.items.findIndex(
        (item) => item.productId === productId
      );
      // if item not found in the bakset, then return -1
      if (itemIndex === -1 || itemIndex === undefined) return;
      // if item found in the basket, then reduce the item quantity
      // by 1. Use non-null assertion operator that basket is not null
      state.basket!.items[itemIndex].quantity -= quantity;
      // if the basket item quantity is zero, then remove completely
      // from the basket
      if (state.basket?.items[itemIndex].quantity === 0) {
        state.basket.items.splice(itemIndex, 1);
      }
    },
  },
});

// Once a slice is created, then export the generated redux action
// creators and the reducer function for the whole slice
export const { setBasket, removeItem } = basketSlice.actions;

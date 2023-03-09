import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/Basket";
import agent from "../../app/api/agent";

interface BasketState {
  basket: Basket | null;
  // to handle the loading status
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

// Redux thunk function contains async logic (Make an API request)
// createAsyncThunk - provide a string for action type and a payload
// creator callback that does the actual async login and return a promise
// with a result.

interface AsyncBasketAdd {
  productId: number;
  quantity?: number;
}

export const addBasketItemAsync = createAsyncThunk<Basket, AsyncBasketAdd>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (error) {
      console.log(error);
    }
  }
);

interface AsyncBasketRemove {
  productId: number;
  quantity: number;
  name?: string;
}

export const removeBasketItemAsync = createAsyncThunk<void, AsyncBasketRemove>(
  "basket/removeBasketItemAsync",
  async ({ productId, quantity }) => {
    try {
      return await agent.Basket.removeItem(productId, quantity);
    } catch (error) {
      console.log(error);
    }
  }
);

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
  },
  // slice reducer needs to respond to other actions that weren't defined
  // as part of this slice's reducers field. builder object provide methods
  // that let us define additional case reducers that will run in response
  // to actions defined outside of the slice.
  extraReducers(builder) {
    // define a case reducer that handles a single know action type based
    // on either RTK action creator or a plain action type string
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      // listen for pending state action type dispatched by addBasketItemAsync
      state.status = "pendingAddItem" + action.meta.arg.productId;
      console.log(action);
    });
    // What to do when we have received the basket back when we added an item
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      // the payload is type of Basket because that is what we are
      // returing from the addBasketItemAsync thunk function
      state.basket = action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    // Remove item from the basket
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      // Find the item index in the items collection
      const itemIndex = state.basket?.items.findIndex(
        (item) => item.productId === productId
      );
      // if item not found in the bakset, then return -1
      if (itemIndex === -1 || itemIndex === undefined) return;
      // if item found in the basket, then reduce the item quantity
      // by 1. Use non-null assertion operator that basket is not null
      state.basket!.items[itemIndex].quantity -= quantity!;
      // if the basket item quantity is zero, then remove completely
      // from the basket
      if (state.basket?.items[itemIndex].quantity === 0) {
        state.basket.items.splice(itemIndex, 1);
      }
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

// Once a slice is created, then export the generated redux action
// creators and the reducer function for the whole slice
export const { setBasket } = basketSlice.actions;

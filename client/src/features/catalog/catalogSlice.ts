import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product } from "../../app/models/Product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

/**
 * Need to look up s single item based on its ID, directly without
 * having to check all the other items. This process is known as
 * normalization.
 *
 * createEntityAdapter provide a standardized way to store your data
 * in a slice by taking collection of items and putting them into
 * shape of {ids: [], entities: {}}
 **/
const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[] | undefined>(
  "catalog/fetchProductsAsync",
  async () => {
    try {
      return await agent.Catalog.list();
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error) {
      console.log(error);
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  // Generate {ids: [], entities: {}} object with extra fields defined
  // inside and will be merged in
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  // for the async thunk function: so we can do something with the
  // products when we get them back.
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      // set all products when we received back from the API
      productsAdapter.setAll(state, action.payload!);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    // The goal of this is not to use async method to go and fetch the
    // product from the API unless if it is required
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      // add or update a single entity in the redux store state. the first
      // arg is the state managed by createAdapter and the second arg is an
      // object that represent the entity to add or update. Upsert the
      // Product into the products arary
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

// Generate selectors (extract specific piece of data from the global
// state) for the catalogslice.
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);

/**
 * When fetching data from an API, it's common to have multiple components
 * that need to access the same data. Memoized selectors can be used to cache
 * the results of API requests, so that muliple components can access the
 * data without triggering additional API request. This improve the performance
 * of the application
 */

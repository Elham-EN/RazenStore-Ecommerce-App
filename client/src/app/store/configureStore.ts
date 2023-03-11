import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";

// Redux Store
export const store = configureStore({
  reducer: {
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
  },
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Defined Typed Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Redux: provide state management for our application (powerful & scalable)
 *
 * What is Redux?
 * It is a store (something like DB) for application, it is a place where we can
 * store our application states in a central location and access it from anywhere
 * else in our application.
 *
 * There is only one store per application, but each store can have many reducers
 * or slices of state.
 *
 * Now when we add Redux into our application we are going to add a provider to
 * provide the state to our application.
 *
 * Redux Flow:
 * When we use Redux, we're going to have store and we provide that store to our app
 * Now our app has components that states get passed to. If we want to update the
 * state, if we want to make a change to the states that are inside our store, then
 * we use action, dispatch these actions to our reducers and we can have many of these
 * reducers (Catalog reducer & Basket Reducer) and then we update our store and re-render
 * any components. And Go again with flow
 *
 * Store -> Provider -> App -> Components -> Actions -> Reducers
 *
 * Our store is going to have reducers which is a function and it takes the current state
 * whatever is in our store and an action, then it returns a new state result. That is
 * what we're doing when we dispatch an action and we update the store and we're creating
 * new state result that then get pass down to our app and it's components.
 *
 * Redux best practices:
 * Do not mutate state inside our redux store: we have to create new state and then
 * replace the existing state with that new state.
 *
 * Reducers must not have side effects: They cannot go out and get some data from the
 * API and then update the states based on that data. They have to use pure fucntions
 *
 * They cannot have non-serializable values in state or actions, that means we cannot
 * create class instances or use function inside our state.
 *
 * Redux Toolkit: Simplifies Redux code
 * Redux toolkit is opinionated, it has set ways that we need to do stuff and it does force
 * us to stick to the best practices even if try not to. It has good defaults for store
 * setup. And has Redux add-ons built in. Less boilerplate
 */

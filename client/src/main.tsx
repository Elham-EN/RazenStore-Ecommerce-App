import ReactDOM from "react-dom/client";
import "./app/layout/styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";
import { StoreProvider } from "./app/context/StoreContext";
import { store } from "./app/store/configureStore";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <StoreProvider>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </StoreProvider>
);

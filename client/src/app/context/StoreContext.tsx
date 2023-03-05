import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/Basket";

interface StoreContextValue {
  basket: Basket | null;
  // We are going to get our basket from the API
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

// In order to consume our storecontext by using custom reack hook
export function useStoreContext() {
  // To get our storecontext
  const context = useContext(StoreContext);
  // StoreContext could potentially be undefined if we were to try and
  // access or use this hook and we were outside of where our context is
  // being provided to.
  if (context === undefined)
    throw Error("Oops - we do not seem to be inside the provider");
  return context;
}

// Create our Store provider
export function StoreProvider({ children }: PropsWithChildren) {
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return;
    const items = [...basket.items]; // Copy of basket's items
    // Return the item index if its in the array or return -1 if not
    const itemIndex = items.findIndex((i) => i.productId === productId);
    // if item index exist
    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      // if quantity is zero we want to remove the item from our basket
      if (items[itemIndex].quantity === 0) {
        items.splice(itemIndex, 1);
        // Update the global state Basket'items
        setBasket((prevState) => {
          return { ...prevState!, items };
        });
      }
    }
  };

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}

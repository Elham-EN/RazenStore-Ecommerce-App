import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import Catalog from "../../features/catalog/Catalog";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="App">
      <h1>RazenStore</h1>
      <Catalog products={products} />
    </div>
  );
}

export default App;

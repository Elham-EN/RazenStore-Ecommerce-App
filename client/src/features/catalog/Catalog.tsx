import React from "react";
import { Product } from "../../app/models/Product";
interface Props {
  products: Product[];
}

export default function Catalog({ products }: Props) {
  return (
    <>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </>
  );
}

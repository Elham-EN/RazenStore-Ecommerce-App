import { Grid } from "@mui/material";
import { Product } from "../../app/models/Product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
    <Grid
      container
      spacing={4}
      sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
    >
      {products.map((product: Product) => (
        <Grid item xs={8} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

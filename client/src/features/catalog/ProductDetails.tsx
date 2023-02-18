import { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!product) {
    return <h3>product not found</h3>;
  }

  return (
    <Grid container spacing={6} sx={{ justifyContent: { xs: "center" } }}>
      <Grid item xs={8} md={6}>
        {/*Take the full width of this six-column grid*/}
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={8} md={6}>
        <Typography variant="h4">{product.name}</Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Typography variant="h5" color={"secondary.main"}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          mt={5}
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Button
            sx={{ mr: { sm: 5 }, mb: { xs: 3, sm: 0 } }}
            variant="contained"
          >
            Add to Cart
          </Button>
          <Button variant="contained">Buy Now</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

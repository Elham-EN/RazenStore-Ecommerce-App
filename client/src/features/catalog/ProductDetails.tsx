import { useEffect, useState } from "react";
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
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleAddItem = (productId: number) => {
    setButtonLoading(true);
    agent.Basket.addItem(productId)
      .catch((error) => console.log(error))
      .finally(() => {
        setButtonLoading(false);
        toast.success("item added to the card");
      });
  };

  useEffect(() => {
    id &&
      agent.Catalog.details(parseInt(id))
        .then((response) => setProduct(response))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingComponent message="Loading product details..." />;
  }

  if (!product) {
    return <NotFound />;
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
          <LoadingButton
            loading={buttonLoading}
            onClick={() => handleAddItem(product.id)}
            sx={{ mr: { sm: 5 }, mb: { xs: 3, sm: 0 } }}
            variant="contained"
          >
            Add to Cart
          </LoadingButton>
          <Button variant="contained">Buy Now</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

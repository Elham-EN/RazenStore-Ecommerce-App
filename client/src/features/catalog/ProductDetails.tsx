import { useEffect, useState, ChangeEvent } from "react";
import {
  Divider,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";
import { useStoreContext } from "../../app/context/StoreContext";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  //how many items does the user already have of item inside the basket
  const [quantity, setQuantity] = useState(0);
  const [sumitting, setSubmitting] = useState(false);
  const { basket, setBasket, removeItem } = useStoreContext();
  //need to find out if we have the item in our basket
  const item = basket?.items.find((item) => item.productId === product?.id);

  useEffect(() => {
    // sets the quantity if we have the item
    if (item) setQuantity(item.quantity);
    id &&
      agent.Catalog.details(parseInt(id))
        .then((response) => setProduct(response))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [id, item]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) >= 0)
      setQuantity(parseInt(event.target.value));
  };

  // if we are removing the item from the cart (as we are reducing the qty)
  // we need to know if we are adding item to the cart (increasing qty)
  // Need to know if we are add new item to the cart
  const handleUpdateCart = async () => {
    setSubmitting(true); // turn on the loading flag
    // check if we have an item and see if the quantity in our local state
    // is greater than the item.quantity. Because if our local state is
    // greater, that means we're adding to the items quantity and if do
    // not have an item, that means we're also adding an item to the basket
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      try {
        const basket = await agent.Basket.addItem(
          product?.id!,
          updatedQuantity
        );
        setBasket(basket);
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
      // if we do have the item or the quantity is less than item.quantity
      // then we are removing from the item
    } else {
      const updatedQuantity = item.quantity - quantity;
      try {
        const basket = await agent.Basket.removeItem(
          product?.id!,
          updatedQuantity
        );
        setBasket(basket);
        removeItem(item.productId, updatedQuantity);
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

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
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              loading={sumitting}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

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
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  //how many items does the user already have of item inside the basket
  const [quantity, setQuantity] = useState(0);
  const { basket, status } = useAppSelector((state) => state.basket);
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  // Select specific product
  const product = useAppSelector((state) =>
    productSelectors.selectById(state, id!)
  );
  const dispatch = useAppDispatch();
  //need to find out if we have the item in our basket
  const item = basket?.items.find((item) => item.productId === product?.id);

  useEffect(() => {
    // sets the quantity if we have the item
    if (item) setQuantity(item.quantity);
    // if we do not have the product, then get the product
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, dispatch, product]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) >= 0)
      setQuantity(parseInt(event.target.value));
  };

  // if we are removing the item from the cart (as we are reducing the qty)
  // we need to know if we are adding item to the cart (increasing qty)
  // Need to know if we are add new item to the cart
  const handleUpdateCart = async () => {
    // check if we have an item and see if the quantity in our local state
    // is greater than the item.quantity. Because if our local state is
    // greater, that means we're adding to the items quantity and if do
    // not have an item, that means we're also adding an item to the basket
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      try {
        dispatch(
          addBasketItemAsync({
            productId: product?.id!,
            quantity: updatedQuantity,
          })
        );
      } catch (error) {
        console.log(error);
      }
      // if we do have the item or the quantity is less than item.quantity
      // then we are removing from the item
    } else {
      const updatedQuantity = item.quantity - quantity;
      try {
        dispatch(
          removeBasketItemAsync({
            productId: product?.id!,
            quantity: updatedQuantity,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (productStatus.includes("pendingFetchProduct")) {
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
              loading={status.includes("pending")}
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

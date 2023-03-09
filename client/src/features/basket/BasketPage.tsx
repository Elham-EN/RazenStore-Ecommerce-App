import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

export default function BasketPage() {
  // Access Redux State basket
  const { basket, status } = useAppSelector((state) => state.basket);
  // Dispatch Action to update the redux state
  const dispatch = useAppDispatch();

  if (!basket)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <Typography sx={{ mb: 5 }} variant="h3">
        {basket.items.length > 0 ? "Your Basket" : "Your Basket is empty"}
      </Typography>
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">SubTotal</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {basket.items.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component={"th"} scope="row">
                    <Box display={"flex"} alignItems={"center"}>
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{ height: 50, marginRight: 20 }}
                      />
                      <span>{item.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    ${(item.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      loading={
                        status === "pendingRemoveItem" + item.productId + "rem"
                      }
                      onClick={() =>
                        dispatch(
                          removeBasketItemAsync({
                            productId: item.productId,
                            quantity: 1,
                            name: "rem",
                          })
                        )
                      }
                      color="error"
                    >
                      <Remove />
                    </LoadingButton>
                    {item.quantity}
                    <LoadingButton
                      loading={status === "pendingAddItem" + item.productId}
                      onClick={() =>
                        dispatch(
                          addBasketItemAsync({ productId: item.productId })
                        )
                      }
                      color="primary"
                    >
                      <Add />
                    </LoadingButton>
                  </TableCell>
                  <TableCell align="right">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <LoadingButton
                      loading={
                        status === "pendingRemoveItem" + item.productId + "del"
                      }
                      onClick={() =>
                        dispatch(
                          removeBasketItemAsync({
                            productId: item.productId,
                            quantity: item.quantity,
                            name: "del",
                          })
                        )
                      }
                      color="error"
                    >
                      <Delete />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container sx={{ marginTop: 5 }}>
          <Grid item xs={0} md={6} />
          <Grid item xs={12} md={6} component={Paper}>
            <BasketSummary />
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              size="large"
              fullWidth
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
      </>
    </>
  );
}

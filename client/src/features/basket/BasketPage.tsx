import {
  Box,
  Button,
  Grid,
  IconButton,
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
import { useStoreContext } from "../../app/context/StoreContext";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "./basketSlice";

export default function BasketPage() {
  // const [loading, setLoading] = useState(true);
  // const [basket, setBasket] = useState<Basket | null>(null);

  // useEffect(() => {
  //   agent.Basket.get()
  //     .then((basket) => setBasket(basket))
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false));
  // }, []);

  // if (loading) return <LoadingComponent message="Loading basket..." />;

  // const { basket, setBasket, removeItem } = useStoreContext();

  // Access Redux State basket
  const { basket } = useAppSelector((state) => state.basket);
  // Dispatch Action to update the redux state
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState({
    loading: false,
    name: "",
  });

  const handleAddItem = async (productId: number, name: string) => {
    setStatus({ loading: true, name });
    try {
      const basket = await agent.Basket.addItem(productId);
      //Update our global state Basket Object
      dispatch(setBasket(basket));
    } catch (error) {
      console.log(error);
    } finally {
      setStatus({ loading: false, name: "" });
    }
  };

  const handleRemoveItem = async (
    productId: number,
    quantity = 1,
    name: string
  ) => {
    setStatus({ loading: true, name });
    try {
      // const basket = await agent.Basket.removeItem(productId, quantity);
      // setBasket(basket)
      // removeItem(productId, quantity);
      await agent.Basket.removeItem(productId, quantity);
      dispatch(removeItem({ productId, quantity }));
    } catch (error) {
      console.log(error);
    } finally {
      setStatus({ loading: false, name: "" });
    }
  };

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
                        status.loading && status.name === "rem" + item.productId
                      }
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          1,
                          "rem" + item.productId
                        )
                      }
                      color="error"
                    >
                      <Remove />
                    </LoadingButton>
                    {item.quantity}
                    <LoadingButton
                      loading={
                        status.loading && status.name === "add" + item.productId
                      }
                      onClick={() =>
                        handleAddItem(item.productId, "add" + item.productId)
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
                        status.loading && status.name === "del" + item.productId
                      }
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.quantity,
                          "del" + item.productId
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
          <Grid item xs={6} />
          <Grid item xs={6} component={Paper}>
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

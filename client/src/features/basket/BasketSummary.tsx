import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";

export default function BasketSummary() {
  const { basket } = useStoreContext();

  const subtotal = basket?.items.reduce((subTotal, item) => {
    return subTotal + item.quantity * item.price;
  }, 0);

  const subTotalFixed = (subtotal! / 100).toFixed(0);

  let deliveryFee: number;

  if (parseInt(subTotalFixed) < 100) {
    deliveryFee = 5;
  } else {
    deliveryFee = 0;
  }

  if (parseInt(subTotalFixed) === 0) deliveryFee = 0;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">${subTotalFixed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">${deliveryFee}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                ${parseInt(subTotalFixed) + deliveryFee}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

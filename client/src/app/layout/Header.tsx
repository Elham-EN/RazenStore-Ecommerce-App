import { ShoppingCart, Menu } from "@mui/icons-material";
import {
  AppBar,
  Switch,
  Toolbar,
  Typography,
  List,
  ListItem,
  IconButton,
  Badge,
  Box,
  Divider,
  Drawer,
} from "@mui/material";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";
import { useAppSelector } from "../store/configureStore";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
  },
  textDecoration: "none",
};

interface Props {
  paletteType: string;
  onSwitch: () => void;
}

export default function Header({ paletteType, onSwitch }: Props) {
  // To get access to the state from redux store
  const { basket } = useAppSelector((state) => state.basket);
  // const { basket } = useStoreContext();
  // Get the items inside the basket and multiplied by each of their quantity
  // use reduce - to reduce an array of items that have a quantity value and
  // we want to reduce that array into single number that we can use to populate
  // into our basket icon (badge)
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 200;
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "left", ml: 1, mt: 10 }}>
      <Typography
        component={NavLink}
        to={"/"}
        sx={{ color: "inherit", textDecoration: "none", my: 2 }}
        variant="h6"
      >
        Home
      </Typography>
      <Divider />
      <List>
        {midLinks.map(({ path, title }) => (
          <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
            {title.toUpperCase()}
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ mb: 4, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Typography
              component={NavLink}
              to={"/"}
              sx={{ color: "inherit", textDecoration: "none" }}
              variant="h6"
            >
              RAZEN-STORE
            </Typography>
            <Switch color="primary" onChange={onSwitch} />
          </Box>
          <List sx={{ display: { xs: "none", md: "flex" } }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              component={Link}
              to={"/basket"}
            >
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              component={Link}
              to={"/basket"}
            >
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component={"nav"} sx={{ overflow: "auto" }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              height: 350,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

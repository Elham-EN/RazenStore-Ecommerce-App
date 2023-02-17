import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const onSwitch = () => {
    if (darkMode === false) {
      setDarkMode(true);
      return;
    }
    setDarkMode(false);
  };
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header paletteType={paletteType} onSwitch={onSwitch} />
      <Container sx={{ mb: 4 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;

import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { useState } from "react";

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
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header paletteType={paletteType} onSwitch={onSwitch} />
      <Container sx={{ mb: 4 }}>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
}

export default App;

import { AppBar, Switch, Toolbar, Typography, Stack } from "@mui/material";

interface Props {
  paletteType: string;
  onSwitch: () => void;
}

export default function Header({ paletteType, onSwitch }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Stack direction={"row"} alignItems={"center"}>
        <Toolbar>
          <Typography variant="h6">RAZEN-STORE</Typography>
        </Toolbar>
        <Typography>
          {paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Mode
        </Typography>
        <Switch color="primary" onChange={onSwitch} />
      </Stack>
    </AppBar>
  );
}

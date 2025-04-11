"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: { mode: "dark" },
  typography: {
    fontFamily:
      'var(--font-inter), "Helvetica Neue", Helvetica, Arial, sans-serif',
    button: {
      textTransform: "none",
    },
  },
});

export default theme;

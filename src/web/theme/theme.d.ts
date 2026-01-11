import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      accentGradient: string;
    };
  }

  interface ThemeOptions {
    custom?: {
      accentGradient?: string;
    };
  }
}

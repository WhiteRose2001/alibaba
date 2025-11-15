// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";
import type { PaletteOptions, PaletteMode } from "@mui/material/styles";

/**
 * Ścisły typ palety, w którym pewne pola są wymagane.
 * Dzięki temu można bezpiecznie odwoływać się do palette.primary.main itp.
 */
type StrictColor = {
  main: string;
  light?: string;
  dark?: string;
  contrastText?: string;
};

type StrictPalette = PaletteOptions & {
  mode: PaletteMode;
  primary: StrictColor;
  secondary: StrictColor;
  background: { default: string; paper: string };
  text: { primary: string; secondary?: string };
  action?: { hover?: string };
};

/* DARK THEME — Cyber Twilight */
export const DARK_PALETTE: StrictPalette = {
  mode: "dark",
  primary: {
    main: "#7B66FF",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#131722",
    contrastText: "#000000",
  },
  background: {
    default: "#0C0F18",
    paper: "#131722",
  },
  text: {
    primary: "#E8ECF7",
    secondary: "#8993B2",
  },
  action: {
    hover: "rgba(123, 102, 255, 0.12)",
  },
};

// rozszerzone pola żeby zadowolić StrictPalette jeśli oczekuje light/dark
export const LIGHT_PALETTE: StrictPalette = {
  mode: "light",
  primary: {
    main: "#ff478a",          // neon pink (Vice City core color)
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ffac4cff",          // neon cyan / Miami turquoise
    contrastText: "#000000",
  },
  background: {
    default: "#FDF8FF",       // bardzo jasny pastelowy róż
    paper: "#ffffff",
  },
  text: {
    primary: "#2A0F33",       // głęboki fiolet (synthwave shadow)
    secondary: "#6A4F80",     // pastelowo-fioletowy
  },
  action: {
    hover: "rgba(255, 119, 198, 0.12)", // neon pink glow
  },
};







export const getTheme = (mode: PaletteMode) => {
  // używamy StrictPalette, ale createTheme przyjmie go jako PaletteOptions
  const palette: StrictPalette = mode === "dark" ? DARK_PALETTE : LIGHT_PALETTE;

  // bezpieczny kontrast (możesz też użyć palette.primary.contrastText jeśli go ustalisz)
  const contrast = palette.mode === "dark" ? (palette.primary.contrastText ?? "#ffffff") : (palette.primary.contrastText ?? "#000000");

  const theme = createTheme({
    palette,
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: { fontFamily: "Poppins, Inter, sans-serif" },
      h2: { fontFamily: "Poppins, Inter, sans-serif" },
      h3: { fontFamily: "Poppins, Inter, sans-serif" },
      button: { textTransform: "none" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            fontFamily: "Inter, sans-serif",
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.primary.main} 100%)`,
            color: contrast,
            boxShadow: "none",
            "& .MuiToolbar-root, & .MuiTypography-root, & .MuiSvgIcon-root, & .MuiButton-root": {
              color: "inherit",
            },
            "& .MuiSvgIcon-root, & .MuiButton-root, & .MuiTypography-root": {
              color: `${contrast} !important`,
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 10,
          },
          containedPrimary: {
            backgroundColor: palette.primary.main,
            color: contrast,
            "&:hover": {
              filter: "brightness(0.9)",
              backgroundColor: palette.primary.main,
            },
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "background 180ms ease, color 180ms ease",
            "&.Mui-selected": {
              backgroundColor: palette.primary.main,
              color: contrast,
              "& .MuiListItemText-primary": {
                color: `${contrast} !important`,
              },
              "& .MuiListItemIcon-root": {
                color: `${contrast} !important`,
              },
              "& .MuiSvgIcon-root": {
                color: `${contrast} !important`,
              },
            },
            "&:hover": {
              backgroundColor: palette.action?.hover,
            },
          },
        },
      },

      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: palette.primary.main,
            transition: "color .18s ease",
            ".MuiListItemButton-root:hover &": {
              color: palette.primary.main,
            },
            ".MuiListItemButton-root.Mui-selected &": {
              color: `${contrast} !important`,
            },
            ".Mui-selected &": {
              color: `${contrast} !important`,
            },
          },
        },
      },

      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
          },
        },
      },
    },
  });

  return theme;
};

export default getTheme;

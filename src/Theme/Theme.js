import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

import yellow from "@material-ui/core/colors/yellow";
import deepOrange from "@material-ui/core/colors/deepOrange";

const lightPalette = {
  primary: {
    main: "#6388cb"
  },
  background: {
    default: "#d0e0ff",
    overlay: "rgba(255,255,255,.5)",
    radial:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(215,237,255,1) 100%)",
    inset: "#0065ff1c",
    alert: yellow[100]
  },
  border: {
    primary: "#b4d2ff",
    overlay: "#b4d2ff",
    primaryLight: "#d3e4fd",
    alert: "#cbc693"
  },
  text: {
    subtle: "rgba(0,0,0,.25)",
    secondarySubtle: "#c5cae9",
    primary: "#395D9E",
    secondary: "#b47200",
    alert: "#847700"
  },
  secondary: {
    main: "#f18a00"
  },
  error: deepOrange,
  contrastThreshold: 1,
  tonalOffset: 0.3
};
const buttonContainedSecondaryLight = {
  background:
    "linear-gradient(0deg, rgba(255,222,172,1) 0%, rgba(255,255,255,1) 100%)",
  color: "#b47200",
  border: "1px solid #c39a60",
  "&:hover": {
    boxShadow:
      "0px 3px 2px -2px rgba(0,0,0,0.2), inset 0px -10px 10px -5px rgba(255, 197, 108)"
  }
};

const buttonContainedSecondaryDark = {
  background:
    "linear-gradient(0deg, rgb(220, 132, 0) 0%, rgb(249, 223, 183) 100%)",
  color: "#965f00",
  "&:hover": {
    boxShadow:
      "0px 3px 2px -2px rgba(0,0,0,0.2), inset 0px -10px 10px -5px rgba(255, 197, 108)"
  }
};

const darkPalette = {
  type: "dark",
  primary: {
    main: "rgb(95, 121, 169)"
  },
  background: {
    default: "rgb(39,54,81)",
    overlay: "rgb(15,21,32,.3)",
    radial: "radial-gradient(circle, rgb(39,54,81) 0%, rgb(15,21,32) 100%)",
    inset: "rgba(0,0,0,.2)",
    alert: "#888148",
    paper: "rgb(39,54,81)"
  },
  border: {
    primary: "black",
    overlay: "rgb(30, 53, 95)",
    primaryLight: "#d3e4fd",
    alert: "#888148"
  },
  text: {
    primary: "rgb(136, 156, 193)",
    subtle: "rgba(0,0,0,.25)",
    secondary: "rgba(255,255,255,.4)",
    secondarySubtle: "rgba(255,255,255,.25)",
    alert: "#888148"
  },
  secondary: {
    main: "rgb(208,119,0)"
  },
  error: deepOrange,
  contrastThreshold: 2,
  tonalOffset: 0.3
};

const GetTheme = useLightTheme => {
  return responsiveFontSizes(
    createMuiTheme({
      palette: useLightTheme ? lightPalette : darkPalette,
      typography: {
        fontFamily: "Rubik, sans-serif"
      },
      overrides: {
        MuiChip: { outlinedPrimary: { color: "#395D9E" } },
        MuiButton: {
          root: {
            fontWeight: "bold",
            lineHeight: "inherit !important"
          },
          startIcon: {
            marginLeft: "-4px",
            marginRight: "4px"
          },
          contained: {
            boxShadow: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            "&:hover": {
              boxShadow: "0px 3px 2px -2px rgba(0,0,0,0.2)"
            },
            "&:active": {
              boxShadow: "0px 3px 2px -2px rgba(0,0,0,0.2)"
            }
          },
          containedPrimary: {
            background: "linear-gradient(to bottom, #85b1ff 0%, #2467dc 100%)",
            border: "1px solid #003da8",
            "&:hover": {
              boxShadow:
                "0px 3px 2px -2px rgba(0,0,0,0.2), inset 0px -10px 10px -5px #0d49b3"
            }
          },
          containedSecondary: useLightTheme
            ? buttonContainedSecondaryLight
            : buttonContainedSecondaryDark
        },
        MuiDialogContentText: {
          root: {
            color: "#6388cb"
          }
        },
        // Style sheet name ⚛️
        MuiCardActions: {
          // Name of the rule
          root: {
            // Some CSS
            justifyContent: "flex-end"
          }
        },
        MuiList: {
          padding: {
            paddingBottom: "0px",
            paddingTop: "0px"
          }
        }
      }
    }),
    { factor: 3 }
  );
};

export default GetTheme;

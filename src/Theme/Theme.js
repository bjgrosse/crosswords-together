import { createMuiTheme, responsiveFontSizes, rgbToHex } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import yellow from '@material-ui/core/colors/yellow';
import deepOrange from '@material-ui/core/colors/deepOrange';
const Theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main:  '#003da8'
    },
    background: {
      default: '#d0e0ff',
      overlay: 'rgba(255,255,255,.5)',
      alert: yellow[100]
    },
    border: {
      primary: '#b4d2ff',
      alert: '#cbc693'
    },
    text: {
      subtle: 'rgba(0,0,0,.25)',
      secondarySubtle: '#c5cae9',
      primary: '#6388cb',
      secondary: '#b47200',
      alert: '#847700'
    },
    secondary: {
      main: '#f18a00'
    },
    error: deepOrange,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.4,
  },
  typography: {
    fontFamily: 'Rubik, sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        color: '#b47200',
        fontWeight: 'bold'
      }
    },
    // Style sheet name ⚛️
    MuiCardActions: {
      // Name of the rule
      root: {
        // Some CSS
        justifyContent: 'flex-end',
      },
    },

  },
}));

export default Theme
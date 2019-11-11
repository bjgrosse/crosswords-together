import { createMuiTheme, responsiveFontSizes, rgbToHex } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
const Theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main:  '#cfd8dc'
    },
    background: {
      default: blueGrey[50]
    },
    text: {
      subtle: 'rgba(0,0,0,.25)',
      secondarySubtle: '#c5cae9',
      primary: '#607d8b',
      secondary: '#90a4ae'
    },
    secondary: {
      main: '#5c6bc0'
    },
    error: deepOrange,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  overrides: {
    MuiButton: {
      root: {
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
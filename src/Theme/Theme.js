import { createMuiTheme, responsiveFontSizes, rgbToHex } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import yellow from '@material-ui/core/colors/yellow';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { lineHeight } from '@material-ui/system';
const Theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: '#003da8'
    },
    background: {
      default: '#d0e0ff',
      overlay: 'rgba(255,255,255,.5)',
      alert: yellow[100],
    },
    border: {
      primary: '#b4d2ff',
      primaryLight: '#d3e4fd',
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
        fontWeight: 'bold',
        lineHeight: 'inherit !important'
      },
      startIcon: {
        marginLeft: '-4px',
        marginRight: '4px'
      },
      contained: {
        boxShadow: 'none',
        borderRadius: '8px',
        padding: '6px 12px',
        '&:hover': {
          boxShadow: '0px 3px 2px -2px rgba(0,0,0,0.2)'
        },
        '&:active': {
          boxShadow: '0px 3px 2px -2px rgba(0,0,0,0.2)'
        }
      },
      containedPrimary: {
        background: 'linear-gradient(to bottom, #85b1ff 0%, #2467dc 100%)',
        border: '1px solid #003da8',
        '&:hover': {
          
          boxShadow: '0px 3px 2px -2px rgba(0,0,0,0.2), inset 0px -10px 10px -5px #0d49b3'
        }
        
      },
      containedSecondary: {
        background: 'linear-gradient(0deg, rgba(255,222,172,1) 0%, rgba(255,255,255,1) 100%)',
        color: '#b47200',
        border: '1px solid #c39a60',
        '&:hover': {
          boxShadow: '0px 3px 2px -2px rgba(0,0,0,0.2), inset 0px -10px 10px -5px rgba(255, 197, 108)'
        }
        
      }
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
        justifyContent: 'flex-end',
      },
    },
    MuiList: {
      padding: {
        paddingBottom: '0px',
        paddingTop: '0px'
      }
    }
  },
}), {factor: 3});

export default Theme
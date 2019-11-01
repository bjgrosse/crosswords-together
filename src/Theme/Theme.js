import { createMuiTheme } from '@material-ui/core/styles';

const Theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiCardActions: {
        // Name of the rule
        root: {
          // Some CSS
          justifyContent: 'flex-end',
        },
      },
    },
  });

  export default Theme
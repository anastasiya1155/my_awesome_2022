import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: teal[700],
      light: teal[500],
      dark: teal[900],
    },
    secondary: {
      main: blue[900],
      light: blue[500],
      dark: blue[900],
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        type: 'button',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
  },
  typography: {
    fontSize: 14,
  },
});

export default theme;

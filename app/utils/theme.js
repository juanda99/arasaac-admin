import { createMuiTheme } from '@material-ui/core/styles';
import lightGreen from '@material-ui/core/colors/lightGreen';

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: lightGreen[500],
      main: lightGreen[500],
      dark: lightGreen[500],
      // contrastText: theme.palette.getContrastText(theme.palette.primary[500]),
    },
    /*
    secondary: {
      light: theme.palette.secondary.A200,
      main: theme.palette.secondary.A400,
      dark: theme.palette.secondary.A700,
      contrastText: theme.palette.getContrastText(theme.palette.secondary.A400),
    },
    error: {
      light: theme.palette.error[300],
      main: theme.palette.error[500],
      dark: theme.palette.error[700],
      contrastText: theme.palette.getContrastText(theme.palette.error[500]),
    },
    */
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;

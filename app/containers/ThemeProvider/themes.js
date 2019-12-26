import { DEFAULT_THEME, DARK_THEME, LIGHT_THEME } from 'containers/ThemeSelector/constants'
import { createMuiTheme } from '@material-ui/core/styles'
// import purple from '@material-ui/core/colors/purple'
// import green from '@material-ui/core/colors/green'

// TODO: change green color // #F44336

const green = {
  300: '#81c784',
  500: '#4caf50',
  700: '#388e3c',
}

const primary = green
// const accent = purple.A200 // #E040FB

const themes = {}
themes[LIGHT_THEME] = {
  palette: {
    primary: {
      main: '#8BC151', // light y dark
      contrastText: '#fff',
      white: '#fff',
    },
    secondary: {
      main: '#81388d',
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
}

themes[DARK_THEME] = {
  palette: {
    primary,
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
  typography: {
    useNextVariants: true,
  },
}

const getTheme = (theme = DEFAULT_THEME, direction) => {
  const currentTheme = themes[theme]
  currentTheme.direction = direction
  return createMuiTheme(currentTheme)
}

export default getTheme

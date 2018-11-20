import { DEFAULT_THEME, DARK_THEME, LIGHT_THEME } from 'containers/ThemeSelector/constants'
import { createMuiTheme } from '@material-ui/core/styles'
// import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'

const primary = green // #F44336
// const accent = purple.A200 // #E040FB

const themes = {}
themes[LIGHT_THEME] = {
  palette: {
    primary,
    // accent,
  },
}

themes[DARK_THEME] = {
  palette: {
    primary,
    type: 'dark', // Switching the dark mode on is a single property value change.
    overrides: {
      MuiButton: {
        // Name of the component ⚛️ / style sheet
        root: {
          // Name of the rule
          color: 'red', // Some CSS
        },
      },
    },
  },
}

const getTheme = (theme = DEFAULT_THEME) => {
  const currentTheme = themes[theme]
  return createMuiTheme(currentTheme, {
    typography: {
      useNextVariants: true,
    },
  })
}

export default getTheme

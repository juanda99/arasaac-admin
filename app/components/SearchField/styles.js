const styles = theme => ({
  root: { display: 'flex', wrap: 'nowrap', height: 250 },
  container: { position: 'relative', flexGrow: 1, maxWidth: 600 },
  button: {
    height: '54px',
  },
  searchButtons: {
    position: 'absolute',
    right: 0,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  searchIcon: {
    // height: '54px',
  },
  input: {
    flexGrow: 1,
    borderColor: 'red',
  },
  menuItem: {},

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      boxShadow: 'rgba(0, 0, 0, 0.20) 0px 1px 6px, rgba(0, 0, 0, 0.20) 0px 1px 4px',
      // borderColor: `${theme.palette.primary.main} !important`,
      border: 'none !important',
    },
  },

  cssFocused: {
    // boxShadow: 'rgba(0, 0, 0, 0.20) 0px 1px 6px, rgba(0, 0, 0, 0.20) 0px 1px 4px',
    // borderColor: `${theme.palette.primary.main} !important`,
    // border: 'none !important',
  },

  notchedOutline: {
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    // borderWidth: '1px',
    // borderColor: 'green !important',
  },
})

export default styles

const styles = theme => ({
  button: {
    height: '54px',
  },
  searchButtons: {
    position: 'absolute',
    right: 0,
  },
  searchIcon: {
    // height: '54px',
  },
  input: {
    flexGrow: 1,
    borderColor: 'red',
  },
  menuItem: {},
  container: {
    flexGrow: 1,
    // border: '1px solid black',
    // boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    // height: '48px',
  },
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

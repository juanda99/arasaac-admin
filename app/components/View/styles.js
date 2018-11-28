const styles = theme => ({
  root: {
    padding: 10,
    // Match [md, ∞[
    //       [960px, ∞[
    [theme.breakpoints.up('md')]: {
      padding: '100',
    },
  },
})

export default styles

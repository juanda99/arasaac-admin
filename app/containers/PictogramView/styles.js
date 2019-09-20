const styles = theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    alignContent: 'top',
  },
  pictoWrapper: {
    maxWidth: '500px',
    marginRight: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: '20px',
  },
})

export default styles

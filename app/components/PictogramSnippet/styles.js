const styles = theme => ({
  cardTitle: {
    textAlign: 'center',
    fontSize: '1.4rem',
    textTransform: 'uppercase',
    color: theme.palette.primary.white,
    fontWeight: '900',
  },
  cardActions: {
    position: 'absolute',
    top: 0,
    button: 0,
    width: '250px',
    height: '250px',
    opacity: 0,
    '&:hover': {
      opacity: 0.93,
    },
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    marginBottom: '30px',
    width: '250px',
    height: '250px',
    minWidth: '250px',
  },
  image: {
    backgroundColor: 'white',
    width: '100%',
    height: 'auto',
  },
})

export default styles

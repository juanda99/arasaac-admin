const styles = theme => ({
  cardTitle: {
    textAlign: 'center',
    fontSize: '1.4rem',
    textTransform: 'uppercase',
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
    backgroundColor: theme.palette.primary,
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
})

export default styles

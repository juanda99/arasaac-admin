const styles = theme => ({
  dropZone: {
    color: theme.palette.accent1Color,
    width: '100%',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: theme.palette.primary1Color,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: '150px',
    maxWidth: '800px',
  },
  img: {
    marginRight: '1rem',
    maxWidth: '400px',
    flexGrow: 1,
    opacity: 0.5,
  },
})

export default styles

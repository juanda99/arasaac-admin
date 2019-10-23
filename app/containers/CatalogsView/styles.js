const styles = theme => ({
  tab: {
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 16,
  },
  '@keyframes rotation': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(359deg)' },
  },
  rotateIcon: {
    animationName: '$rotation',
  },
})

export default styles

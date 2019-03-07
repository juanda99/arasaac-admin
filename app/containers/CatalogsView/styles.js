const styles = theme => ({
  tab: {
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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

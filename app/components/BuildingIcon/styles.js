const styles = theme => ({
  '@keyframes rotation': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(359deg)' },
  },
  rotateIcon: {
    animation: 'rotation 4s 2s infinite',
    animationTimingFunction: 'linear',
  },
})

export default styles

const styles = theme => ({
  pictoWrapper: {
    maxWidth: '300px',
    marginRight: '60px',
  },
  [theme.breakpoints.down('sm')]: {
    pictoWrapper: {
      marginRight: '20px',
    },
  },
  pictogram: {
    backgroundColor: '#FEFEFE',
    backgroundImage:
      'linear-gradient(45deg, #CBCBCB 25%, transparent 25%, transparent 75%, #CBCBCB 75%, #CBCBCB), linear-gradient(45deg, #CBCBCB 25%, transparent 25%, transparent 75%, #CBCBCB 75%, #CBCBCB)',
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0, 5px 5px',
    backgroundRepeat: 'repeat',
    position: 'relative',
  },
})

export default styles

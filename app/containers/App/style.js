import { drawerWidth, transition } from '../../global-styles'

const appStyle = theme => ({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    float: theme.direction === 'rtl' ? 'left' : 'right',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  content: {
    marginTop: '65px',
    // padding: '30px 15px',
    // minHeight: 'calc(100vh - 123px)',
  },
  container: {
    marginTop: '70px',
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  LoadingBar: {
    height: 2,
    backgroundColor: 'rgb(0, 188, 212)',
    zIndex: 100000,
  },
})

export default appStyle

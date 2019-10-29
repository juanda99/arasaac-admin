import { drawerWidth } from '../../global-styles'

const styles = theme => ({
  appBar: {
    position: 'absolute',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    boxShadow: 'none',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  grow: {
    flexGrow: 1,
    paddingLeft: 80,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  h6: {},
})

export default styles

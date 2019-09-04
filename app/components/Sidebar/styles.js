import { drawerWidth, boxShadow } from '../../global-styles'

const sidebarStyle = theme => ({
  drawerPaper: {
    position: 'fixed',
    ...boxShadow,
    width: drawerWidth,
  },
  subMenu: {
    paddingLeft: '15px',
  },
  headerSubMenu: {
    color: theme.palette.text.primary,
    paddingLeft: '15px',
  },
  navlink: {
    textDecoration: 'none',
  },
  logoLink: {
    textTransform: 'uppercase',
    padding: '5px 0',
    display: 'block',
    fontSize: '18px',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: '#000',
    },
  },
  logoImage: {
    width: '30px',
    display: 'inline-block',
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '15px',
  },
  img: {
    width: '35px',
    top: '22px',
    position: 'absolute',
    verticalAlign: 'middle',
    border: '0',
  },
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    height: 64,
    color: 'white',
    fontWeight: 300,
    fontSize: 24,
    paddingLeft: 85,
    paddingTop: 20,
  },
})

/*
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    height: '100vh',
  },
});

*/

export default sidebarStyle

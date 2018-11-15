import { drawerWidth, boxShadow } from '../../global-styles'

const sidebarStyle = theme => ({
  drawerPaper: {
    position: 'fixed',
    ...boxShadow,
    width: drawerWidth,
  },
  logo: {
    position: 'relative',
    display: 'flex',
    padding: '15px 15px',
    width: 'calc(100% - 160px)',
    float: 'left',
    zIndex: '4',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      height: '1px',
      right: '15px',
      width: 'calc(100% - 90px)',
      backgroundColor: 'rgba(180, 180, 180, 0.3)',
    },
  },
  subMenu: {
    paddingLeft: '15px',
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

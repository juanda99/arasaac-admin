import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import MenuItem from './MenuItem'
import styles from './styles'

class SideBar extends React.Component {
  state = {
    isOpen: {},
  }

  handleIsOpen = key => {
    this.setState(prevState => {
      const state = { isOpen: prevState.isOpen }
      state.isOpen[key] = !prevState.isOpen[key]
      return state
    })
  }

  toggleSidebar = () => {
    this.props.handleSidebarToggle()
  }

  render() {
    const { classes, theme, logo, routes, open } = this.props
    const links = (
      <List>
        {routes.filter(route => route.isSidebar).map(
          (route, key) =>
            route.children ? (
              <MenuItem
                {...route}
                /* eslint-disable-next-line react/no-array-index-key */
                key={key}
                item={key}
                handleIsOpen={() => this.handleIsOpen(key)}
                open={this.state.isOpen[key]}
              />
            ) : (
              /* eslint-disable-next-line react/no-array-index-key */
              <MenuItem {...route} key={key} item={key} />
            ),
        )}
      </List>
    )

    const drawer = (
      <div>
        <div className={classes.toolbar} role="button">
          ARASAAC
        </div>
        {links}
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    )

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={open}
            onClose={this.toggleSidebar}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  logoText: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  handleSidebarToggle: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(SideBar)

import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SignoutIcon from '@material-ui/icons/Block'
import messages from './messages'
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

  handleLogoClick = () => this.props.history.push('/')

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
        <div className={classes.toolbar} role="button" onClick={this.handleLogoClick}>
          ARASAAC
        </div>
        {links}
        <Divider />
        {this.props.isAuthenticated && (
          <List>
            <ListItem button key="logOutOption">
              <ListItemIcon>
                <SignoutIcon />
              </ListItemIcon>
              <ListItemText primary={<FormattedMessage {...messages.signout} />} onClick={() => this.props.logout()} />
            </ListItem>
          </List>
        )}
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
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(withRouter(SideBar))

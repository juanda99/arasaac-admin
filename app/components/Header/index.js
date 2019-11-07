import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { withRouter } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import Hidden from '@material-ui/core/Hidden'
import AccountCircle from '@material-ui/icons/AccountCircle'
import UserOptionsIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LocaleSelector from 'containers/LocaleSelector'
import ThemeSelector from 'containers/ThemeSelector'

/*
import FormatTextdirectionLToR from '@material-ui/icons/FormatTextdirectionLToR'
import FormatTextdirectionRToL from '@material-ui/icons/FormatTextdirectionRToL'
*/
import messages from './messages'
import styles from './styles'

class Header extends Component {
  state = {
    loginButton: null,
  }

  handleLogout = () => {
    // this.setState({ auth: event.target.checked })
    this.props.logout()
    this.setState({ loginButton: null })
  }

  handleSignin = () => {
    this.props.history.push('/signin')
  }

  handleAuthMenu = event => {
    this.setState({ loginButton: event.currentTarget })
  }

  handleAuthClose = () => {
    this.setState({ loginButton: null })
  }

  toggleSidebar = () => {
    this.props.handleSidebarToggle()
  }

  getTitle = () => {
    let title
    const url = this.props.location.pathname
    switch (true) {
      case /pictograms\/add/.test(url):
        title = <FormattedMessage {...messages.addPictograms} />
        break
      case /pictograms/.test(url):
        title = <FormattedMessage {...messages.pictograms} />
        break
      case /catalogs/.test(url):
        title = <FormattedMessage {...messages.catalogs} />
        break
      case /users/.test(url):
        title = <FormattedMessage {...messages.users} />
        break
      case /signin/.test(url):
        title = <FormattedMessage {...messages.signin} />
        break
      default:
        title = <FormattedMessage {...messages.management} />
        break
    }
    return title
  }

  render() {
    const { classes, isAuthenticated } = this.props
    const { loginButton } = this.state
    // TODO: move get title to componentUpdate
    const title = this.getTitle()

    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open menu"
              onClick={this.toggleSidebar}
            >
              <MenuIcon style={{ color: 'white' }} />
            </IconButton>
          </Hidden>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {title}
          </Typography>
          <ThemeSelector />
          <LocaleSelector />
          {isAuthenticated ? (
            <React.Fragment>
              <Tooltip title={<FormattedMessage {...messages.userMenu} />} enterDelay={300}>
                <IconButton
                  aria-owns={loginButton ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleAuthMenu}
                >
                  <UserOptionsIcon style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Menu id="menu-appbar" anchorEl={loginButton} open={Boolean(loginButton)} onClose={this.handleAuthClose}>
                <MenuItem onClick={this.handleAuthClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleAuthClose}>My account</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            <IconButton aria-owns={loginButton ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleSignin}>
              <AccountCircle style={{ color: 'white' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSidebarToggle: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(withRouter(Header))

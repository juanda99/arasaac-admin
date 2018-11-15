import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import Hidden from '@material-ui/core/Hidden'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import LanguageIcon from '@material-ui/icons/Language'
/*
import FormatTextdirectionLToR from '@material-ui/icons/FormatTextdirectionLToR'
import FormatTextdirectionRToL from '@material-ui/icons/FormatTextdirectionRToL'
import LightbulbFullIcon from './LightbulbFull'
import LightbulbOutlineIcon from './LightbulbOutline'
*/
import messages from './messages'
import styles from './styles'

class Header extends Component {
  state = {
    auth: true,
    loginButton: null,
    languageButton: null,
  }

  handleLogout = event => {
    this.setState({ auth: event.target.checked })
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

  render() {
    const { classes } = this.props
    const { auth, loginButton, languageButton } = this.state

    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open menu" onClick={this.toggleSidebar}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Arasaac Management
          </Typography>
          <Tooltip title={<FormattedMessage {...messages.changeLanguage} />} enterDelay={300}>
            <IconButton
              color="inherit"
              aria-owns={languageButton ? 'language-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleLanguageIconClick}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Menu id="language-menu" anchorEl={languageButton} open={Boolean(languageButton)} onClose={this.handleLanguageMenuClose}>
            <MenuItem selected onClick={() => this.handleLanguageMenuItemClick('en')}>
              English
            </MenuItem>
            <MenuItem selected={false} onClick={() => this.handleLanguageMenuItemClick('zh')}>
              中文
            </MenuItem>
          </Menu>
          {auth && (
            <React.Fragment>
              <Tooltip title={<FormattedMessage {...messages.userMenu} />} enterDelay={300}>
                <IconButton aria-owns={loginButton ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleAuthMenu}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu id="menu-appbar" anchorEl={loginButton} open={Boolean(loginButton)} onClose={this.handleAuthClose}>
                <MenuItem onClick={this.handleAuthClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleAuthClose}>My account</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          )}
          {!auth && <Button color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSidebarToggle: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(Header)

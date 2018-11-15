import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
import LightbulbOutlineIcon from '@material-ui/icons/LightbulbOutline'
import LightbulbFullIcon from '@material-ui/icons/LightbulbFull'
import LanguageIcon from '@material-ui/icons/Language'
import FormatTextdirectionLToR from '@material-ui/icons/FormatTextdirectionLToR'
import FormatTextdirectionRToL from '@material-ui/icons/FormatTextdirectionRToL'
import styles from './styles'

class Header extends Component {
  state = {
    auth: true,
    anchorEl: null,
  }

  handleChange = event => {
    this.setState({ auth: event.target.checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  toggleSidebar = () => {
    this.props.handleSidebarToggle()
  }

  render() {
    const { classes } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Tooltip title="Change language" enterDelay={300}>
            <IconButton
              color="inherit"
              aria-owns={languageMenu ? 'language-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleLanguageIconClick}
              data-ga-event-category="AppBar"
              data-ga-event-action="language"
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Menu id="language-menu" anchorEl={languageMenu} open={Boolean(languageMenu)} onClose={this.handleLanguageMenuClose}>
            <MenuItem selected={userLanguage === 'en'} onClick={() => this.handleLanguageMenuItemClick('en')}>
              English
            </MenuItem>
            <MenuItem selected={userLanguage === 'zh'} onClick={() => this.handleLanguageMenuItemClick('zh')}>
              中文
            </MenuItem>
          </Menu>
          <Tooltip title="Toggle light/dark theme" enterDelay={300}>
            <IconButton
              color="inherit"
              onClick={this.handleTogglePaletteType}
              aria-label="Toggle light/dark theme"
              data-ga-event-category="AppBar"
              data-ga-event-action="dark"
            >
              {uiTheme.paletteType === 'light' ? <LightbulbOutlineIcon /> : <LightbulbFullIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle right-to-left/left-to-right" enterDelay={300}>
            <IconButton
              color="inherit"
              onClick={this.handleToggleDirection}
              aria-label="Toggle right-to-left/left-to-right"
              data-ga-event-category="AppBar"
              data-ga-event-action="rtl"
            >
              {uiTheme.direction === 'rtl' ? <FormatTextdirectionLToR /> : <FormatTextdirectionRToL />}
            </IconButton>
          </Tooltip>
          <Hidden mdUp>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open menu" onClick={this.toggleSidebar}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Arasaac Management
          </Typography>
          {auth && (
            <div>
              <IconButton aria-owns={open ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
                <MenuItem onClick={this.handleChange}>Logout</MenuItem>
              </Menu>
            </div>
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

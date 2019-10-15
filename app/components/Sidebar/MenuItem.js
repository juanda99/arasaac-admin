import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

const MenuItem = props => {
  const { title, icon, children, path, open, handleIsOpen, item, classes } = props
  const prueba = () => handleIsOpen(item)
  return (
    <div>
      {children ? (
        <div>
          <ListItem button onClick={prueba} className={classes.headerSubMenu}>
            <ListItemIcon>{typeof icon === 'string' ? <Icon>{icon}</Icon> : <props.icon />}</ListItemIcon>
            <ListItemText primary={title} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit className={classes.subMenu}>
            <List component="div" disablePadding>
              {children.map((child, index) => (
                /* eslint-disable-next-line react/no-array-index-key */
                <NavLink to={child.path} key={index} className={classes.navlink}>
                  <ListItem button>
                    <ListItemIcon>
                      {typeof child.icon === 'string' ? <Icon>{child.icon}</Icon> : <child.icon />}
                    </ListItemIcon>
                    <ListItemText primary={child.title} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Collapse>
        </div>
      ) : (
        <NavLink to={path} key={path} className={classes.navlink}>
          <ListItem button>
            <ListItemIcon>{typeof icon === 'string' ? <Icon>{icon}</Icon> : <props.icon />}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        </NavLink>
      )}
    </div>
  )
}

MenuItem.propTypes = {
  title: PropTypes.object,
  icon: PropTypes.func.isRequired,
  children: PropTypes.array,
  path: PropTypes.string,
  open: PropTypes.bool,
  handleIsOpen: PropTypes.func,
  item: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(MenuItem)

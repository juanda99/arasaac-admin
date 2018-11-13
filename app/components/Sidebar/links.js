import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
    
const links = ({title, icon, children, path, component, open, handleOpen }) => (
  <div>
    { children ? (
      <div>
        <ListItem button onClick={handleOpen}>
          <ListItemIcon>
            {typeof icon === "string" ? (
              <Icon>{icon}</Icon>
            ) : (
                <icon />
              )}
          </ListItemIcon>
          <ListItemText
            inset
            primary={title}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {children.map((child)=> {
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                {typeof child.icon === "string" ? (
                  <Icon>{child.icon}</Icon>
                ) : (
                    <child.icon />
                  )}
              </ListItemIcon>
              <ListItemText
                inset
                primary={child.title}
              />
            </ListItem>
          })}
          </List>
        </Collapse>
      </div>
    ) : (
      <NavLink to={path} key={path}>
        <ListItem button>
          <ListItemIcon>
            {typeof icon === "string" ? (
              <Icon>{icon}</Icon>
            ) : (
              <icon />
            )}
          </ListItemIcon>
          <ListItemText
            inset
            primary={title}
          />
        </ListItem>
      </NavLink>
    )} 
  </div>
)

export default links

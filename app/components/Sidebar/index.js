import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PictogramUploadIcon from '@material-ui/icons/AddPhotoAlternate';
import PictogramsIcon from '@material-ui/icons/Collections';
import TagsIcon from '@material-ui/icons/Style';
import UsersIcon from '@material-ui/icons/People';
import NewsIcon from '@material-ui/icons/Chat';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';

class SideBar extends React.Component {
  state = {
    openPictograms: true,
    openNews: true,
  };

  handleClickPictograms = () => {
    this.setState(state => ({ openPictograms: !state.openPictograms }));
  };

  handleClickNews = () => {
    this.setState(state => ({ openNews: !state.openNews }));
  };

  handleDrawerToggle = () => {
    this.props.onClose();
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} role="button">
          ARASAAC
        </div>
        <Divider />
        <List>
          <ListItem button onClick={this.handleClickPictograms}>
            <ListItemIcon>
              <PictogramsIcon />
            </ListItemIcon>
            <ListItemText
              inset
              primary={<FormattedMessage {...messages.pictograms} />}
            />
            {this.state.openPictograms ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openPictograms} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <PictogramUploadIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={<FormattedMessage {...messages.uploadPictograms} />}
                />
              </ListItem>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <TagsIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={<FormattedMessage {...messages.tagPictograms} />}
                />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={this.handleClickNews}>
            <ListItemIcon>
              <NewsIcon />
            </ListItemIcon>
            <ListItemText
              inset
              primary={<FormattedMessage {...messages.news} />}
            />
            {this.state.openNews ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openNews} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={<FormattedMessage {...messages.createNew} />}
                />
              </ListItem>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={<FormattedMessage {...messages.searchNews} />}
                />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button>
            <ListItemIcon>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText
              inset
              primary={<FormattedMessage {...messages.users} />}
            />
          </ListItem>
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.props.mobileOpen}
            onClose={this.handleDrawerToggle}
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
    );
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(SideBar);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';

import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import logo from 'images/arasaac-logo.svg';
import routes from '../../routes';

import GlobalStyle from '../../global-styles';
import style from './style';

const getRoutes = () =>
  routes.map((route, key) => {
    if (route.children) {
      return route.children.map((subRoute, subkey) => (
        <Route
          path={subRoute.path}
          component={subRoute.component}
          /* eslint-disable-next-line react/no-array-index-key */
          key={`${key}-${subkey}`}
        />
      ));
    }
    /* eslint-disable-next-line react/no-array-index-key */
    return <Route path={route.path} component={route.component} key={key} />;
  });

export class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    sidebarOpen: false,
  };

  handleSidebarToggle = () => {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText="ARASAAC"
          logo={logo}
          handleSidebarToggle={this.handleSidebarToggle}
          open={this.state.sidebarOpen}
          onClose={this.handleSidebarToggle}
        />
        <div className={classes.mainPanel}>
          <Header
            routes={routes}
            handleSidebarToggle={this.handleSidebarToggle}
          />
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>{getRoutes()}</Switch>
            </div>
          </div>
        </div>
        <GlobalStyle />
      </div>
    );
  }
}

export default withStyles(style)(App);

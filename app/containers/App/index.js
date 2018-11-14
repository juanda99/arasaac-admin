/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

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

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => (
      <Route path={prop.path} component={prop.component} key={key} />
    ))}
  </Switch>
);

export class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText="ARASAAC"
          logo={logo}
          handleDrawerToggle={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
          onClose={this.handleDrawerToggle}
        />
        <div className={classes.mainPanel}>
          <Header
            routes={routes}
            handleDrawerToggle={this.handleDrawerToggle}
          />
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        </div>
        <GlobalStyle />
      </div>
    );
  }
}

export default withStyles(style)(App);

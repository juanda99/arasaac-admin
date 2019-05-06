import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import logo from 'images/arasaac-logo.svg'
// import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
// import reducer from './reducer'
import saga from './sagas'
import routes from '../../routes'
import { makeSelectHasUser } from './selectors'

import styles from './style'

const getRoutes = () =>
  routes.map((route, key) => {
    console.log(route.path)
    if (route.children) {
      return route.children.map((subRoute, subkey) => (
        <Route
          path={subRoute.path}
          component={subRoute.component}
          exact
          /* eslint-disable-next-line react/no-array-index-key */
          key={`${key}-${subkey}`}
        />
      ))
    }
    /* eslint-disable-next-line react/no-array-index-key */
    return <Route path={route.path} component={route.component} key={key} />
  })

export class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    sidebarOpen: false,
  }

  handleSidebarToggle = () => {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }))
  }

  render() {
    const { classes } = this.props
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
          <Header routes={routes} handleSidebarToggle={this.handleSidebarToggle} locale theme />
          <div className={classes.content}>
            <Switch>{getRoutes()}</Switch>
          </div>
        </div>
      </div>
    )
  }
}

// export default withStyles(styles, { withTheme: true })(App)

const mapStateToProps = state => {
  const isAuthenticated = (makeSelectHasUser()(state) && true) || false
  return {
    isAuthenticated,
  }
}

const withConnect = connect(
  mapStateToProps,
  null,
)

// const withReducer = injectReducer({ key: 'auth, reducer })
const withSaga = injectSaga({ key: 'auth', saga })

export default compose(
  withConnect,
  withSaga,
)(withStyles(styles, { withTheme: true })(App))

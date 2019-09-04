import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import logo from 'images/arasaac-logo.svg'
// import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
// import reducer from './reducer'
import saga from './sagas'
import routes from '../../routes'
import { makeSelectHasUser } from './selectors'
import { logout } from './actions'

import styles from './style'

const getRoutes = () =>
  routes.map((route, key) => {
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
    isAuthenticated: PropTypes.bool.isRequired,
    doLogout: PropTypes.func.isRequired,
  }

  state = {
    sidebarOpen: false,
  }

  handleSidebarToggle = () => {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }))
  }

  render() {
    const { classes, isAuthenticated, doLogout } = this.props
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
            locale
            theme
            isAuthenticated={isAuthenticated}
            logout={doLogout}
          />
          <LoadingBar
            style={{
              height: 2,
              backgroundColor: 'rgb(0, 188, 212)',
              zIndex: 100000,
              position: 'relative',
              top: '64px',
            }}
            updateTime={100}
            maxProgress={95}
            progressIncrease={20}
          />
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

const mapDispatchToProps = dispatch => ({
  doLogout: () => {
    dispatch(logout())
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

const withSaga = injectSaga({ key: 'auth', saga })

export default compose(
  withConnect,
  withSaga,
)(withStyles(styles, { withTheme: true })(App))

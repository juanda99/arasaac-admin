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
import { create } from 'jss'
import rtl from 'jss-rtl'
import { StylesProvider, jssPreset } from '@material-ui/core/styles'
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
    // if (route.path === '/pictograms/:idPictogram/:searchText?') {
    //   // see https://github.com/ReactTraining/react-router/issues/4105
    //   return <Route path={route.path} render={PictogramViewWrapper} key={route.path} />
    // }
    return <Route path={route.path} component={route.component} key={route.path} />
  })

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] })

export class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    doLogout: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
  }

  state = {
    sidebarOpen: false,
  }

  handleSidebarToggle = () => {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }))
  }

  render() {
    const { classes, isAuthenticated, doLogout, direction } = this.props
    return (
      <StylesProvider jss={jss}>
        <div className={classes.wrapper} dir={direction}>
          <Sidebar
            routes={routes}
            logoText="ARASAAC"
            logo={logo}
            handleSidebarToggle={this.handleSidebarToggle}
            open={this.state.sidebarOpen}
            onClose={this.handleSidebarToggle}
            isAuthenticated={isAuthenticated}
            logout={doLogout}
          />
          <div className={classes.mainPanel}>
            <Header
              routes={routes}
              handleSidebarToggle={this.handleSidebarToggle}
              isAuthenticated={isAuthenticated}
              logout={doLogout}
            />
            <div className={classes.content}>
              <Switch>{getRoutes()}</Switch>
            </div>
          </div>
          <LoadingBar
            style={{
              height: 2,
              backgroundColor: '#78909c',
              zIndex: 100000,
              position: 'absolute',
              top: '64px',
            }}
            updateTime={100}
            maxProgress={95}
            progressIncrease={20}
            direction={direction}
          />
        </div>
      </StylesProvider>
    )
  }
}

// export default withStyles(styles, {withTheme: true })(App)

const mapStateToProps = state => {
  const isAuthenticated = (makeSelectHasUser()(state) && true) || false
  const direction = state.getIn(['language', 'direction'])
  return {
    isAuthenticated,
    direction,
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

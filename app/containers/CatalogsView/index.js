import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import openSocket from 'socket.io-client'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import { compose } from 'redux'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import injectReducer from 'utils/injectReducer'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import LinearProgress from '@material-ui/core/LinearProgress'
import reducer from './reducer'
import saga from './sagas'
import { catalogs, generateCatalog, generateAllCatalogs } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class CatalogsView extends React.PureComponent {
  state = {
    completed: 0,
  }

  componentDidMount() {
    // get last data from our catalogs
    // make ajax call or use websocket (as we will use it afterwards)

    // get current status: generating, crompressing and so on
    const socket = openSocket('https://privateapi.arasaac.org')
    socket.on('backupPercent', completed => this.setState({ completed }))
  }

  render() {
    const { classes } = this.props
    console.log(`completed: ${this.state.completed}`)

    return (
      <View>
        <div className={classes.root}>
          <p>Lista de catálogos</p>
          <LinearProgress variant="determinate" value={this.state.completed} />
        </div>
      </View>
    )
  }
}

CatalogsView.propTypes = {
  classes: PropTypes.object.isRequired,
  requestCatalogs: PropTypes.func.isRequired,
  generateCatalog: PropTypes.func.isRequired,
  generateAllCatalogs: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
})

const mapDispatchToProps = dispatch => ({
  requestCatalogs: () => {
    dispatch(catalogs.request())
  },
  generateCatalog: locale => {
    dispatch(generateCatalog.request(locale))
  },
  generateAllCatalogs: () => {
    dispatch(generateAllCatalogs.request())
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'catalogsView', reducer })
// const withSaga = injectSaga({ key: 'pictogramsView', saga, mode: DAEMON })

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(CatalogsView)))

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import View from 'components/View'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { FormattedMessage } from 'react-intl'
import reducer from '../UsersView/reducer'
import saga from './sagas'
import { makeLoadingSelector, makeUserByIdSelector, makeUsersSelector } from '../UsersView/selectors'
import { user } from './actions'
import styles from './styles'
import messages from './messages'

class UsersView extends React.PureComponent {
  componentDidMount = () => {
    const { requestUser } = this.props
    requestUser()
  }

  componentDidUpdate() {
    // load Data
  }

  render() {
    const { classes, width } = this.props

    return (
      <View>
        <h1>{<FormattedMessage {...messages.header} />}</h1>
        <p>{this.props.user.name}</p>
        <p>{this.props.user.email}</p>
      </View>
    )
  }
}

UsersView.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  requestUser: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  loading: makeLoadingSelector()(state),
  users: makeUsersSelector()(state),
  user: makeUserByIdSelector()(state, ownProps),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: () => {
    dispatch(user.request())
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'usersView', reducer })
const withSaga = injectSaga({ key: 'usersView', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(UsersView)))

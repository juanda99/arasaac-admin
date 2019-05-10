import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import 'moment/min/locales'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import View from 'components/View'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { FormattedMessage } from 'react-intl'
import { makeUserByIdSelector } from 'containers/UsersView/selectors'
import UserForm from 'components/UserForm'
import reducer from './reducer'
import saga from './sagas'
import { user } from './actions'
import styles from './styles'
import messages from './messages'

class UserView extends React.PureComponent {
  componentDidMount = () => {
    const { requestUser, match /* , selectedUser */ } = this.props
    // we update the user from server anyway!
    // if (!selectedUser) {
    //   requestUser(match.params.idUser)
    // }
    requestUser(match.params.idUser)
  }

  componentDidUpdate() {
    // load Data
  }

  render() {
    const { classes, width, selectedUser } = this.props
    moment.locale('fr')
    if (selectedUser) var item = moment(1316116057189).fromNow()
    return (
      <View>
        <p>{item}</p>
        <h1>{<FormattedMessage {...messages.header} />}</h1>
        {selectedUser ? (
          <div>
            <UserForm initialValues={selectedUser} />
          </div>
        ) : (
          <p>Still no data :-(</p>
        )}
      </View>
    )
  }
}

UserView.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  requestUser: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  selectedUser: makeUserByIdSelector()(state, ownProps),
})

const mapDispatchToProps = dispatch => ({
  requestUser: id => {
    dispatch(user.request(id))
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
)(withStyles(styles, { withTheme: true })(withWidth()(UserView)))

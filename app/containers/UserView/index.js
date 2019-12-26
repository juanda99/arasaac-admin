import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { makeUserByIdSelector, makeLoadingSelector, makeSelectIdUser } from 'containers/UsersView/selectors'
import { makeSelectHasUser } from 'containers/App/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import UserForm from 'components/UserForm'
import reducer from 'containers/UsersView/reducer'
import saga from './sagas'
import { user, userUpdate } from './actions'

class UserView extends React.PureComponent {
  componentDidMount = () => {
    const { requestUser, idUser, selectedUser, token } = this.props
    // maybe in the saga we can decide to get it from state
    // and not from server
    if (!selectedUser) requestUser(token, idUser)
  }

  componentDidUpdate() {
    // load Data
  }

  handleSubmit = userData => {
    this.props.requestUserUpdate(this.props.token, { ...userData, updated: new Date() })
  }

  render() {
    const { selectedUser, locale } = this.props
    return (
      <View>
        {selectedUser ? (
          <div>
            <h1>{selectedUser.name}</h1>
            <UserForm initialValues={selectedUser} locale={locale} onSubmit={this.handleSubmit} />
          </div>
        ) : (
          <p>Still no data :-(</p>
        )}
      </View>
    )
  }
}

UserView.propTypes = {
  requestUser: PropTypes.func.isRequired,
  requestUserUpdate: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  locale: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  idUser: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  loading: makeLoadingSelector()(state),
  selectedUser: makeUserByIdSelector()(state, ownProps),
  idUser: makeSelectIdUser()(state, ownProps),
  locale: makeSelectLocale()(state),
  token: makeSelectHasUser()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUser: (token, id) => {
    dispatch(user.request(token, id))
  },
  requestUserUpdate: (token, userData) => {
    dispatch(userUpdate.request(token, userData))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'usersView', reducer })
const withSaga = injectSaga({ key: 'userView', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UserView)

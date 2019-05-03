/*
 *
 * LoginView
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import View from 'components/View'
// import { withStyles } from '@material-ui/core/styles'
import { LoginForm } from 'components/Login'
import SocialLogin from 'components/SocialLogin'
import Separator from 'components/Separator'
import Logo from 'components/Logo'
import AlertWindow from 'components/AlertWindow'
import { login, socialLogin, resetError } from 'containers/App/actions'
import ConditionalPaper from 'components/ConditionalPaper'

const handleSubmit = (requestLogin, formData) => {
  // this.props.login.request('pepito', 'password')
  const user = formData.get('username')
  const password = formData.get('password')
  requestLogin(user, password)
}

const LoginView = props => {
  const { error, requestLogin, resetError, requestAppToken } = props
  let showError = null
  if (error) {
    showError = <AlertWindow title="Autenticación" desc="Usuario no válido" onReset={resetError} />
  }
  return (
    <View>
      {showError}
      <ConditionalPaper>
        <Logo />
        <SocialLogin onSuccess={requestAppToken} />
        <Separator />
        <LoginForm onSubmit={formData => handleSubmit(requestLogin, formData)} message={error} />
      </ConditionalPaper>
    </View>
  )
}

LoginView.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  resetError: PropTypes.func.isRequired,
  requestAppToken: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.getIn(['auth', 'error']),
})

const mapDispatchToProps = dispatch => ({
  requestLogin: (username, password) => {
    dispatch(login.request(username, password))
  },
  resetError: () => {
    dispatch(resetError())
  },
  requestAppToken: (token, socialNetwork) => {
    dispatch(socialLogin.request(token, socialNetwork))
  },
})

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )
// const withReducer = injectReducer({ key: 'usersView', reducer })
// const withSaga = injectSaga({ key: 'usersView', saga })

// export default compose(
//   withReducer,
//   withSaga,
//   withConnect,
// )(withStyles(styles, { withTheme: true })(withWidth()(injectIntl(UsersView))))

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView)

// export default compose(
//   withReducer,
//   withSaga,
//   withConnect,
// )(withStyles(styles, { withTheme: true })(withWidth()(injectIntl(UsersView))))

/*
 *
 * LoginView
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import View from 'components/View'
import { LoginForm } from 'components/Login'
import SocialLogin from 'components/SocialLogin'
import Separator from 'components/Separator'
import Logo from 'components/Logo'
import AlertWindow from 'components/AlertWindow'
import { injectIntl, intlShape } from 'react-intl'
import { login, socialLogin, resetError } from 'containers/App/actions'
import ConditionalPaper from 'components/ConditionalPaper'
import { getQueryStringValue } from 'utils'
import messages from './messages'
import { makeSelectError, makeSelectHasRole } from '../App/selectors'

const handleSubmit = (requestLogin, formData) => {
  const { username, password } = formData
  requestLogin(username, password)
}

class LoginView extends Component {
  componentDidUpdate() {
    const { isAuthenticated, history } = this.props
    // we redirect or load default directory, depending on initail route
    const redirect = getQueryStringValue('redirect') || '/'
    if (redirect && isAuthenticated) {
      history.push(redirect)
    }
  }

  componentWillMount() {
    const { isAuthenticated, history } = this.props
    // we redirect or load default directory, depending on initail route
    const redirect = getQueryStringValue('redirect') || '/'
    if (redirect && isAuthenticated) {
      history.push(redirect)
    }
  }

  render() {
    const { error, requestLogin, resetError, requestAppToken, intl } = this.props
    const { formatMessage } = intl
    let showError = null
    if (error === 'Failed to fetch') {
      showError = (
        <AlertWindow
          title={formatMessage(messages.authentication)}
          desc={formatMessage(messages.communicationError)}
          onReset={resetError}
        />
      )
    } else if (error) {
      showError = (
        <AlertWindow
          title={formatMessage(messages.authentication)}
          desc={formatMessage(messages.invalidUser)}
          onReset={resetError}
        />
      )
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
}

LoginView.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  resetError: PropTypes.func.isRequired,
  requestAppToken: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

// const mapStateToProps = state => ({
//   error: state.getIn(['auth', 'error']),
// })

const mapStateToProps = state => {
  /* we don't use token for auth, as we wait saga for the profile before redirection!!! */
  const isAuthenticated = (makeSelectHasRole()(state) && true) || false
  const error = makeSelectError()(state)
  return {
    isAuthenticated,
    error,
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(withRouter(LoginView)))

import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form/immutable'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import EmailIcon from '@material-ui/icons/Email'
import { WEB_URL } from 'services/config'
import Button from '@material-ui/core/Button'
import { Row, Col } from 'react-flexbox-grid'
import Div from 'components/Div'
import messages from './messages'
import { email } from './validate'

const styles = {
  checkbox: {
    left: 0,
  },
  text: {
    width: '100%',
    marginTop: '10px',
    marginBottom: '10px',
  },
  register: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  signinButton: {
    width: '100%',
  },
  forgotPassword: {
    marginTop: 0,
    textAlign: 'right',
  },
}

const renderTextField = ({ input, label, placeholder, meta: { touched, error }, ...custom }) => (
  <TextField
    label={(touched && error) || label}
    placeholder={placeholder}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

// based on: https://github.com/erikras/redux-form-material-ui/blob/master/example/src/Form.js
/* eslint-disable import/no-mutable-exports */
let LoginForm = class LoginForm extends Component {
  componentDidMount() {}

  email = value => (email(value) ? '' : <FormattedMessage {...messages.invalidEmail} />)

  required = value => (value == null ? <FormattedMessage {...messages.required} /> : '')

  render() {
    const { handleSubmit, submitting, pristine, username, intl } = this.props
    const { formatMessage } = intl
    // const emailLink = email(username) !== 'Invalid'
    const recoverLink = email(username) ? `/recoverpassword/${username}` : '/recoverpassword/'
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Div top={2}>
            <Field
              name="username"
              component={renderTextField}
              label={<FormattedMessage {...messages.user} />}
              ref={input => {
                this.firstField = input
              }}
              withRef
              style={styles.text}
              placeholder={formatMessage(messages.email)}
              validate={[this.required, this.email]}
              autoComplete="off"
            />
            <Field
              name="password"
              component={renderTextField}
              type="password"
              label={<FormattedMessage {...messages.password} />}
              style={styles.text}
              placeholder={formatMessage(messages.password)}
              validate={[this.required]}
              autoComplete="off"
            />
          </Div>
          <Div top={2}>
            <Button
              variant="contained"
              style={styles.signinButton}
              color="primary"
              type="submit"
              disabled={pristine || submitting}
            >
              <FormattedMessage {...messages.signin} />
            </Button>
          </Div>
          <Div top={2}>
            <Row>
              <Col xs={6} />
              <Col xs={6}>
                <a href={`${WEB_URL}${recoverLink}`} target="_blank">
                  <p style={styles.forgotPassword}>{<FormattedMessage {...messages.forgotPassword} />}</p>
                </a>
              </Col>
            </Row>
          </Div>
        </form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired,
}
LoginForm = reduxForm({
  form: 'signin',
  touchOnBlur: false,
  touchOnChange: true,
  // fields
})(LoginForm)

const selector = formValueSelector('signin')

LoginForm = connect(state => ({
  // can select values individually
  username: selector(state, 'username'),
}))(LoginForm)

export default injectIntl(LoginForm)

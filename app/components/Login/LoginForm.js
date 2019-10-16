/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Field } from 'react-final-form'
import Grid from '@material-ui/core/Grid'
import { TextField } from 'final-form-material-ui'
import { WEB_URL } from 'services/config'
import Button from '@material-ui/core/Button'
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

// based on: https://github.com/erikras/redux-form-material-ui/blob/master/example/src/Form.js
/* eslint-disable import/no-mutable-exports */
const LoginForm = class LoginForm extends Component {
  componentDidMount() {}

  email = value => (email(value) ? undefined : this.props.intl.formatMessage(messages.invalidEmail))

  required = value => (value == null ? this.props.intl.formatMessage(messages.required) : undefined)

  validate = values => {
    const errors = {}
    const { formatMessage } = this.props.intl
    if (!values.username) {
      errors.userName = formatMessage(messages.required)
    }
    if (!values.password) {
      errors.password = formatMessage(messages.required)
    }
    if (!email(values.username)) {
      errors.username = formatMessage(messages.invalidEmail)
    }
    return errors
  }

  handleSubmit = values => {
    console.log(values)
    this.props.onSubmit(values)
  }

  render() {
    const { username, intl } = this.props
    const { formatMessage } = intl
    // const emailLink = email(username) !== 'Invalid'

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => {
            const recoverLink = email(values.username) ? `/recoverpassword/${values.username}` : '/recoverpassword/'
            return (
              <form onSubmit={handleSubmit} noValidate>
                <Grid container alignItems="flex-start" spacing={32}>
                  <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Field
                      fullWidth
                      required
                      name="username"
                      component={TextField}
                      type="text"
                      label={<FormattedMessage {...messages.user} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      required
                      fullWidth
                      component={TextField}
                      type="password"
                      label={<FormattedMessage {...messages.password} />}
                    />
                  </Grid>

                  <Grid item style={{ marginTop: 16 }} xs={12}>
                    <Button fullWidth variant="contained" color="primary" type="submit" disabled={submitting}>
                      Submit
                    </Button>
                  </Grid>
                  <Grid item style={{ marginTop: 16 }} xs={6} />
                  <Grid item style={{ marginTop: 16 }} xs={6}>
                    <a href={`${WEB_URL}${recoverLink}`} target="_blank">
                      <p style={styles.forgotPassword}>{<FormattedMessage {...messages.forgotPassword} />}</p>
                    </a>
                  </Grid>
                </Grid>
              </form>
            )
          }}
        />
      </div>
    )
  }
}

LoginForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectIntl(LoginForm)

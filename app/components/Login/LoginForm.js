import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form/immutable'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import EmailIcon from '@material-ui/icons/Email'
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

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label} floatingLabelText={label} errorText={touched && error} {...input} {...custom} />
)

// based on: https://github.com/erikras/redux-form-material-ui/blob/master/example/src/Form.js
/* eslint-disable import/no-mutable-exports */
let LoginForm = class LoginForm extends Component {
  componentDidMount() {
    this.firstField // the Field
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus() // on TextField
  }

  email = value => (email(value) ? '' : <FormattedMessage {...messages.invalidEmail} />)

  required = value => (value == null ? <FormattedMessage {...messages.required} /> : '')

  render() {
    const { handleSubmit, submitting, pristine, username } = this.props
    // const emailLink = email(username) !== 'Invalid'
    const recoverLink = email(username) ? `/recoverpassword/${username}` : '/recoverpassword/'
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Div top={2}>
            <Button
              variant="contained"
              style={styles.signinButton}
              label={<FormattedMessage {...messages.signin} />}
              primary
              type="submit"
              disabled={pristine || submitting}
            />
          </Div>

          <Div top={2}>
            <Row>
              <Col xs={6} />
              <Col xs={6}>
                <Link to={recoverLink}>
                  <p style={styles.forgotPassword}>{<FormattedMessage {...messages.forgotPassword} />}</p>
                </Link>
              </Col>
            </Row>
          </Div>

          <Div top={2} style={{ position: 'relative' }}>
            <p>{<FormattedMessage {...messages.offerAccount} />}</p>

            <Link to="/register">
              <Button
                variant="contained"
                style={styles.register}
                label={<FormattedMessage {...messages.signup} />}
                secondary
                icon={<EmailIcon />}
              />
            </Link>
          </Div>
        </form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  ...propTypes,
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

export default LoginForm

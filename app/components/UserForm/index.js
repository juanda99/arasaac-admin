import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form/immutable'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import Div from 'components/Div'
import messages from 'components/Login/messages'
import { email } from 'components/Login/validate'

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

let UserForm = class UserForm extends Component {
  componentDidMount() {}

  email = value => (email(value) ? undefined : this.props.intl.formatMessage(messages.invalidEmail))

  required = value => (value == null ? this.props.intl.formatMessage(messages.required) : undefined)

  render() {
    const { handleSubmit, submitting, pristine, username, intl } = this.props
    const { formatMessage } = intl
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Div top={2}>
            <Field
              name="name"
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
          </Div>
        </form>
      </div>
    )
  }
}

UserForm.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired,
  userData: PropTypes.bool.isRequired,
}
UserForm = reduxForm({
  form: 'userForm',
})(UserForm)

const selector = formValueSelector('userForm')

UserForm = connect(state => ({
  // can select values individually
  initialValues: selector(state, 'username'),
}))(UserForm)

export default injectIntl(UserForm)

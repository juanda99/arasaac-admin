import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field, propTypes } from 'redux-form/immutable'
import TextField from '@material-ui/core/TextField'
import EmailIcon from '@material-ui/icons/Email'
import Button from '@material-ui/core/Button'
import P from 'components/P'
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
let RecoverPasswordForm = class RecoverPasswordForm extends Component {
  state = { errors: false }

  componentDidMount() {
    this.firstField // the Field
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus() // on TextField
  }

  componentWillMount() {
    if (email(this.props.email)) {
      this.props.initialize({ username: this.props.email })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invalid) {
      this.setState({ errors: true })
    } else {
      this.setState({ errors: false })
    }
  }

  email = value => (email(value) ? '' : <FormattedMessage {...messages.invalidEmail} />)

  required = value => (value == null ? <FormattedMessage {...messages.required} /> : '')

  render() {
    const { handleSubmit, submitting, pristine, email } = this.props
    this.firstField = email
    return (
      <div>
        <P>{<FormattedMessage {...messages.recoverPasswordInfo} />}</P>
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
              hintText={<FormattedMessage {...messages.email} />}
              validate={[this.required, this.email]}
            />
          </Div>
          <Div top={2}>
            <Button
              variant="contained"
              style={styles.signinButton}
              label={<FormattedMessage {...messages.recoverPassword} />}
              primary
              icon={<EmailIcon />}
              type="submit"
              disabled={this.state.errors || submitting}
            />
          </Div>
        </form>
      </div>
    )
  }
}

RecoverPasswordForm.propTypes = {
  ...propTypes,
}
RecoverPasswordForm = reduxForm({
  form: 'recoverPassword',
  touchOnBlur: false,
  touchOnChange: true,
  // enableReinitialize: true
  // fields
})(RecoverPasswordForm)

export default RecoverPasswordForm

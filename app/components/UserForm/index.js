import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Form, Field } from 'react-final-form'
import { Checkbox, Radio, Select, TextField } from 'final-form-material-ui'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { LANGUAGES } from 'utils/constants'

import moment from 'moment'

import messages from 'components/Login/messages'
import langMessages from 'components/LanguageSelector/messages'
import { email } from 'components/Login/validate'

const styles = {
  checkbox: {
    left: 0,
  },
  text: {
    width: '100%',
    margin: '30px',
    maxWidth: '400px',
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

const UserForm = class UserForm extends Component {
  email = value => (email(value) ? undefined : this.props.intl.formatMessage(messages.invalidEmail))

  validate = values => {
    const errors = {}
    const { formatMessage } = this.props.intl
    if (!values.name) {
      errors.firstName = formatMessage(messages.required)
    }
    if (!email(values.email)) {
      errors.email = formatMessage(messages.invalidEmail)
    }
    return errors
  }

  handleSubmit = values => {
    window.alert(JSON.stringify(values, 0, 2))
    this.props.onSubmit(values)
  }

  render() {
    const { intl, initialValues, locale } = this.props
    const { formatMessage } = intl
    let { lastLogin, created } = initialValues
    moment.locale(locale)
    lastLogin = moment(lastLogin).format('LLLL')
    created = moment(created).format('LLLL')
    return (
      <div>
        <p>Created: {created}</p>
        <p>Last login: {lastLogin}</p>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
          validate={this.validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => {
            if (values.role !== 'translator') {
              // delete values.targetLanguages // maybe we can manteined it!!!
            }
            return (
              <form onSubmit={handleSubmit}>
                <Paper style={{ padding: 32 }}>
                  <Grid container alignItems="flex-start" spacing={32} style={{ marginTop: 16 }}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field fullWidth name="name" component={TextField} type="text" label="Nombre" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field name="email" fullWidth component={TextField} type="email" label="Email" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field name="company" fullWidth component={TextField} type="text" label="Company" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field name="url" fullWidth component={TextField} type="url" label="Sitio web" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field
                        fullWidth
                        name="locale"
                        component={Select}
                        label="Default language"
                        formControlProps={{ fullWidth: true }}
                      >
                        {LANGUAGES.map(language => (
                          <MenuItem key={language} value={language}>
                            {formatMessage(langMessages[language])}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">User role </FormLabel>
                        <RadioGroup row>
                          <FormControlLabel
                            label="User"
                            control={<Field name="role" component={Radio} type="radio" value="user" />}
                          />
                          <FormControlLabel
                            label="Translator"
                            control={<Field name="role" component={Radio} type="radio" value="translator" />}
                          />
                          <FormControlLabel
                            label="Administrator"
                            control={<Field name="role" component={Radio} type="radio" value="admin" />}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {values.role === 'translator' && (
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Target languages:</FormLabel>
                          <FormGroup row>
                            {LANGUAGES.map(language => (
                              <FormControlLabel
                                key={language}
                                label={formatMessage(langMessages[language])}
                                control={
                                  <Field name="targetLanguages" component={Checkbox} type="checkbox" value={language} />
                                }
                              />
                            ))}
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">User options</FormLabel>
                        <FormGroup row>
                          <FormControlLabel
                            label="Active"
                            control={<Field name="active" component={Checkbox} type="checkbox" />}
                          />
                          <FormControlLabel
                            label="Email suscription"
                            control={<Field name="suscription" component={Checkbox} type="checkbox" />}
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item style={{ marginTop: 16 }}>
                      <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </form>
            )
          }}
        />
      </div>
    )
  }
}

UserForm.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectIntl(UserForm)

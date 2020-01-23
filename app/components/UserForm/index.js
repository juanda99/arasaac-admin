import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
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
import { languages } from 'utils/index'

import moment from 'moment'

import messages from 'components/Login/messages'
import langMessages from 'components/LanguageSelector/messages'
import { email } from 'components/Login/validate'

const LANGUAGES = languages.map(language => language.code)

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

  handleSubmit = values => this.props.onSubmit(values)

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
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} lg={4} style={{ maxWidth: '400px', padding: '10px' }}>
                      <Field fullWidth name="name" component={TextField} type="text" label="Nombre" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} style={{ maxWidth: '400px', padding: '10px' }}>
                      <Field name="email" fullWidth component={TextField} type="email" label="Email" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} style={{ maxWidth: '400px', padding: '10px' }}>
                      <Field name="company" fullWidth component={TextField} type="text" label="Company" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} style={{ maxWidth: '400px', padding: '10px' }}>
                      <Field name="url" fullWidth component={TextField} type="url" label="Sitio web" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} style={{ maxWidth: '400px', padding: '10px' }}>
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
                    <Grid item xs={12} style={{ padding: '10px' }}>
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
                      <Grid item xs={12} style={{ padding: '10px' }}>
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
                    <Grid item xs={12} style={{ padding: '10px' }}>
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
                    <Grid item xs={12} style={{ padding: '10px' }}>
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectIntl(UserForm)

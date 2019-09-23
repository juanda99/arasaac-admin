import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Divider from '@material-ui/core/Divider'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { TextField, Select, Checkbox } from 'final-form-material-ui'
import { languages } from 'utils/index'
import CategoriesSelector from 'components/CategoriesSelector'
import ChipInput from 'components/ChipInput'
import MenuItem from '@material-ui/core/MenuItem'
import { FormattedMessage } from 'react-intl'
// see picker doc at https://material-ui-pickers-v2.dmtr-kovalenko.now.sh
// also configured in app.js
import { DatePicker } from 'material-ui-pickers'
import { injectIntl, intlShape } from 'react-intl'
import langMessages from 'components/LanguageSelector/messages'
import styles from './styles'
import messages from './messages'
// import { styles } from 'material-ui-pickers/DatePicker/DatePicker'

const ChipInputWrapper = props => <ChipInput {...props} text="tag" value="key" />
const DatePickerWrapper = props => {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched

  return (
    <DatePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  )
}

const CategoriesSelectorWrapper = props => <CategoriesSelector {...props} />

export class PictogramForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        tag: PropTypes.string.isRequired,
      }).isRequired,
    ),
    item: PropTypes.string,
    categories: PropTypes.object.isRequired,
  }

  state = {
    showSuggestions: false,
    language: localStorage.getItem('referenceLanguage'),
  }

  handleSubmit = values => {
    const { item, onSubmit } = this.props
    onSubmit(values, item)
  }

  toggleSuggestions = () => this.setState(prevState => ({ showSuggestions: !prevState.showSuggestions }))

  handleDateChange = date => {
    console.log(date)
    return null
  }

  handleChangeLanguage = value => {
    console.log(value)
  }

  render() {
    const { data, classes, categories, intl } = this.props
    const { formatMessage } = intl
    const { showSuggestions, language } = this.state
    return (
      <div className={classes.form}>
        <div style={{ marginTop: 30 }}>
          <h2>
            <FormattedMessage {...messages.pictogramData} />
          </h2>
          <Divider />
        </div>
        <Form
          onSubmit={this.handleSubmit}
          mutators={{
            ...arrayMutators,
          }}
          initialValues={data}
          render={({
            handleSubmit,
            form: {
              mutators: { push, pop },
            }, // injected from final-form-arrays above
            pristine,
            form,
            submitting,
            values,
          }) => (
            <>
              <div style={{ display: 'flex', marginTop: 30 }}>
                <h2>
                  <FormattedMessage {...messages.keywordsList} />
                </h2>

                {(!values.keywords || !values.keywords.length) && (
                  <>
                    <Fab
                      style={{ position: 'relative', left: 10, top: -10 }}
                      color="primary"
                      size="small"
                      aria-label="Add"
                      onClick={() => push('keywords', undefined)}
                    >
                      <AddIcon />
                    </Fab>
                  </>
                )}
              </div>
              <Button variant="outlined" color="primary" onClick={this.toggleSuggestions}>
                {showSuggestions ? 'Hide Suggestions' : 'Show suggestions'}
              </Button>
              {showSuggestions && (
                <div className={classes.suggestions}>
                  <p>Choose a language to see the translation in another language</p>
                  <Select value={language} onChange={this.handleChangeLanguage}>
                    {languages.map(item => (
                      <MenuItem key={item.code} selected={language === item.code} onClick={() => onClick(item.code)}>
                        {`${item.text} - ${formatMessage(langMessages[item.code])}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <p>Sugerencias en español:</p>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <FieldArray name="keywords">
                  {({ fields }) =>
                    fields.map((keyword, index) => (
                      <div key={keyword} style={{ display: 'flex', marginBottom: 10 }}>
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field
                            fullWidth
                            name={`${keyword}.keyword`}
                            label="keyword"
                            component={TextField}
                            type="text"
                          />
                        </div>
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field
                            fullWidth
                            name={`${keyword}.plural`}
                            label="plural"
                            component={TextField}
                            type="text"
                          />
                        </div>
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field fullWidth name={`${keyword}.type`} label="id" component={TextField} type="text" />
                        </div>
                        <div>
                          <Fab
                            style={{ marginRight: 10, marginLeft: 10 }}
                            color="primary"
                            size="small"
                            aria-label="Add keyword"
                            onClick={() => push('keywords', undefined)}
                          >
                            <AddIcon />
                          </Fab>

                          <Fab
                            style={{ marginRight: 10, marginLeft: 10 }}
                            color="primary"
                            size="small"
                            aria-label="Remove keyword"
                            onClick={() => fields.remove(index)}
                          >
                            <DeleteIcon />
                          </Fab>
                        </div>
                      </div>
                    ))
                  }
                </FieldArray>

                <div style={{ marginTop: 30 }}>
                  <h2>
                    <FormattedMessage {...messages.pictogramStatus} />
                  </h2>
                  <div style={{ display: 'flex' }}>
                    <FormControlLabel
                      label="Publicado"
                      control={<Field name="published" component={Checkbox} type="checkbox" />}
                    />
                    <FormControlLabel
                      label="Visible para traductores"
                      control={<Field name="available" component={Checkbox} type="checkbox" />}
                    />
                    <FormControlLabel
                      label="Revisado"
                      control={<Field name="validated " component={Checkbox} type="checkbox" />}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <Field
                    name="created"
                    style={{ marginRight: '15px' }}
                    component={DatePickerWrapper}
                    margin="normal"
                    label="Fecha de creación"
                  />

                  <Field
                    name="lastUpdated"
                    component={DatePickerWrapper}
                    margin="normal"
                    label="Fecha de actualización"
                  />
                </div>

                <div style={{ marginTop: 30 }}>
                  <h2>
                    <FormattedMessage {...messages.categories} />
                  </h2>
                  <Field
                    name="tags"
                    component={CategoriesSelectorWrapper}
                    label="Estado del pictograma"
                    categories={categories}
                  />
                </div>

                <div style={{ marginTop: 30 }}>
                  <h2>
                    <FormattedMessage {...messages.synsets} />
                  </h2>
                  <div style={{ maxWidth: '400px' }}>
                    <Field name="synsets" component={ChipInputWrapper} />
                  </div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row-reverse' }}>
                  <Button
                    style={{ marginLeft: '15px' }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    <FormattedMessage {...messages.save} />
                  </Button>

                  <Button variant="contained" color="secondary" type="submit">
                    <FormattedMessage {...messages.cancel} />
                  </Button>
                </div>
                <pre>{JSON.stringify(values, 0, 2)}</pre>
              </form>
            </>
          )}
        />
      </div>
    )
  }
}

PictogramForm.defaultProps = {
  data: {},
}

export default withStyles(styles, { withTheme: true })(injectIntl(PictogramForm))

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { Form, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { OnBlur, OnChange } from 'react-final-form-listeners'
import { TextField, Select, Checkbox } from 'final-form-material-ui'
import jp from 'jsonpath'
import AutoSave from 'components/AutoSave'
import Autosuggest from 'components/Autosuggest'
import { languages } from 'utils/index'
import CategoriesSelector from 'components/CategoriesSelector'
import ChipInput from 'components/ChipInput'
import MenuItem from '@material-ui/core/MenuItem'
// see picker doc at https://material-ui-pickers-v2.dmtr-kovalenko.now.sh
// also configured in app.js
import { DatePicker } from 'material-ui-pickers'
import { injectIntl, FormattedMessage } from 'react-intl'
import langMessages from 'components/LanguageSelector/messages'
import api from 'services'

import styles from './styles'
import messages from './messages'

// import { styles } from 'material-ui-pickers/DatePicker/DatePicker'

const WhenFieldChanges = ({ field, set, values, index, locale }) => (
  <Field name={set}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } },
    ) => (
      <FormSpy subscription={{}}>
        {({ form }) => (
          <OnBlur name={field}>
            {() => {
              const { keyword, type } = values.keywords[index]
              const { idPictogram } = values
              if (!keyword) return
              const endPoint = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20190920T104929Z.2bfd4c00cbc5e87e.d3baecf50951cb94e3834ffee05d92801894da49&lang=${locale}-${locale}&text=${keyword}`
              fetch(endPoint)
                .then(data => data.json())
                .then(data => {
                  const currentType = data && data.def && data.def[0] && data.def[0].pos
                  let valueType = ''
                  /* 1 properName, 2 commonName, 3 verb, 4 descriptive, 5 socialContent, 6 miscellaneous */
                  if (currentType) {
                    switch (currentType) {
                      case 'verb':
                        valueType = 3
                        break
                      case 'noun':
                        valueType = 2
                        break
                      case 'adjective':
                      case 'adverb':
                        valueType = 4
                        break
                      default:
                      // code block
                    }
                    if (valueType) onChange(valueType)
                    else if (!type && locale !== 'es') {
                      api.PICTOGRAM_TYPE_REQUEST(idPictogram).then(data => {
                        if (data.types && data.types.length === 1) {
                          onChange(data.types[0])
                        }
                      })
                    }
                  }
                })
            }}
          </OnBlur>
        )}
      </FormSpy>
    )}
  </Field>
)

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
      format="L"
      value={value === '' ? null : value}
    />
  )
}

const TagsInputWrapper = props => <Autosuggest {...props} />

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
    locale: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
  }

  state = {
    language: localStorage.getItem('referenceLanguage'),
  }

  handleSubmit = values => this.props.onSubmit(values)

  toggleSuggestions = () => this.setState(prevState => ({ showSuggestions: !prevState.showSuggestions }))

  render() {
    const { data, classes, categories, intl, locale, tags } = this.props
    const { formatMessage } = intl
    const { showSuggestions, language } = this.state
    return (
      <div className={classes.form}>
        <Form
          onSubmit={this.handleSubmit}
          mutators={{
            ...arrayMutators,
            putTags: (selectedTags, state, utils) => {
              const newTags = Array.from(new Set([...state.lastFormState.values.tags, ...selectedTags]))
              utils.changeValue(state, 'tags', () => newTags)
            },
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
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <AutoSave debounce={1000} save={handleSubmit} />
              <div style={{ marginTop: 30 }}>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.pictogramData} />
                </Typography>
                <Divider />
              </div>
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  <Typography variant="h5" color="textPrimary" gutterBottom>
                    <FormattedMessage {...messages.keywordsList} />
                  </Typography>

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

                <FieldArray name="keywords">
                  {({ fields }) =>
                    fields.map((keyword, index) => (
                      <div key={keyword} style={{ display: 'flex', marginBottom: 10 }}>
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field
                            fullWidth
                            name={`${keyword}.keyword`}
                            label={<FormattedMessage {...messages.word} />}
                            component={TextField}
                            type="text"
                          />
                        </div>
                        <WhenFieldChanges
                          field={`${keyword}.keyword`}
                          set={`${keyword}.type`}
                          values={values}
                          index={index}
                          locale={locale}
                        />
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field
                            fullWidth
                            name={`${keyword}.plural`}
                            label={<FormattedMessage {...messages.plural} />}
                            component={TextField}
                            type="text"
                          />
                        </div>
                        <div style={{ width: '200px', marginRight: '10px' }}>
                          <Field
                            fullWidth
                            style={{ minWidth: '200px' }}
                            name={`${keyword}.type`}
                            label={<FormattedMessage {...messages.type} />}
                            component={Select}
                            type="text"
                          >
                            <MenuItem value="" />
                            <MenuItem value="1">{<FormattedMessage {...messages.properName} />}</MenuItem>
                            <MenuItem value="2">{<FormattedMessage {...messages.commonName} />}</MenuItem>
                            <MenuItem value="3">{<FormattedMessage {...messages.verb} />}</MenuItem>
                            <MenuItem value="4">{<FormattedMessage {...messages.descriptive} />}</MenuItem>
                            <MenuItem value="5">{<FormattedMessage {...messages.socialContent} />}</MenuItem>
                            <MenuItem value="6">{<FormattedMessage {...messages.miscellaneous} />}</MenuItem>
                          </Field>
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
              </div>

              <div style={{ marginTop: 30 }}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.pictogramStatus} />
                </Typography>
                <div style={{ display: 'flex' }}>
                  <FormControlLabel
                    label={<FormattedMessage {...messages.published} />}
                    control={<Field name="published" component={Checkbox} type="checkbox" />}
                  />
                  <FormControlLabel
                    label={<FormattedMessage {...messages.visible} />}
                    control={<Field name="available" component={Checkbox} type="checkbox" />}
                  />
                  <FormControlLabel
                    label={<FormattedMessage {...messages.validated} />}
                    control={<Field name="validated" component={Checkbox} type="checkbox" />}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <Field
                  name="created"
                  disabled
                  style={{ marginRight: '15px' }}
                  component={DatePickerWrapper}
                  margin="normal"
                  label={<FormattedMessage {...messages.creationDate} />}
                />

                <Field
                  name="lastUpdated"
                  disabled
                  component={DatePickerWrapper}
                  margin="normal"
                  label={<FormattedMessage {...messages.updateDate} />}
                />
              </div>

              <div style={{ marginTop: 30 }}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.categories} />
                </Typography>
                <Field name="categories" component={CategoriesSelectorWrapper} categories={categories} />
              </div>

              <OnChange name="categories">
                {(value, previous) => {
                  // we only add tags
                  if (value.length > previous.length) {
                    const item = value.filter(x => !previous.includes(x))[0]
                    const path = jp.paths(categories, `$..["${item}"]`)[0]
                    const selectedTags = jp.value(categories, path).tags
                    form.mutators.putTags(...selectedTags)
                  }
                }}
              </OnChange>

              <div style={{ marginTop: 30 }}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  {<FormattedMessage {...messages.filters} />}
                </Typography>
                <div style={{ display: 'flex' }}>
                  <FormControlLabel
                    label={<FormattedMessage {...messages.schematic} />}
                    control={<Field name="schematic" component={Checkbox} type="checkbox" />}
                  />
                  <FormControlLabel
                    label={<FormattedMessage {...messages.violence} />}
                    control={<Field name="violence" component={Checkbox} type="checkbox" />}
                  />
                  <FormControlLabel
                    label={<FormattedMessage {...messages.sex} />}
                    control={<Field name="sex" component={Checkbox} type="checkbox" />}
                  />
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.tags} />
                </Typography>
                <div>
                  <Field name="tags" component={TagsInputWrapper} suggestions={tags} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.synsets} />
                </Typography>
                <div>
                  <Field name="synsets" component={ChipInputWrapper} url="http://wordnet-rdf.princeton.edu/id" />
                </div>
              </div>
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
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

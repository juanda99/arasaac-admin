import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import { OnChange } from 'react-final-form-listeners'
import { FormattedMessage, injectIntl } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import ChipInput from 'components/ChipInput'
import Autosuggest from 'components/Autosuggest'
import AutoSave from 'components/AutoSave'
import messages from './messages'
import tagLabels from './tagsMessages'

const KeywordsInputWrapper = props => <ChipInput {...props} />
const TagsInputWrapper = props => <Autosuggest {...props} suggestions={suggestions} />
let suggestions = []
export class CategoryForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    item: PropTypes.string,
    tags: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { tags, intl } = this.props
    const { formatMessage } = intl
    suggestions = tags.map(tag => ({ label: formatMessage(tagLabels[tag]), value: tag })).sort(
      (a, b) =>
        a.label
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') >
        b.label
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          ? 1
          : -1,
    )
    // console.log(suggestions)
    // fix: first time open form, suggestions are loaded after render
    // suggestions = tags.map(tag => {
    //   console.log(tag)
    //   return { label: formatMessage(tagLabels[tag]), value: tag }
    // })
    // this.forceUpdate()
  }

  handleSubmit = async values => {
    const { item, onSubmit } = this.props
    onSubmit(values, item)
  }

  handleClose = values => {
    const { onClose, item } = this.props
    onClose(values, item)
  }

  render() {
    const { data, item } = this.props
    // new category, key empty, edit category, key from item
    const formData = Object.entries(data).length === 0 ? { ...data, key: '' } : { ...data, key: item }
    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={formData}
        mutators={{
          replicate: (args, state, utils) => utils.changeValue(state, 'key', () => state.lastFormState.values.text),
        }}
        render={({ handleSubmit, pristine, form, submitting, values }) => (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {Object.keys(data).length !== 0 && <AutoSave debounce={1000} save={handleSubmit} />}
            <Paper style={{ padding: 32, margin: 20 }}>
              <IconButton style={{ position: 'absolute', right: '50px' }} onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
              <div style={{ marginTop: 30 }}>
                <h3>
                  <FormattedMessage {...messages.key} />
                </h3>
                <OnChange name="text">
                  {(value, previous) => {
                    if (!values.key || values.key === previous) form.mutators.replicate()
                  }}
                </OnChange>
                <div style={{ maxWidth: '400px' }}>
                  <Field
                    fullWidth
                    name="key"
                    component={TextField}
                    type="text"
                    disabled={Object.entries(data).length !== 0}
                  />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <h3>
                  <FormattedMessage {...messages.category} />
                </h3>
                <div style={{ maxWidth: '400px' }}>
                  <Field fullWidth name="text" component={TextField} type="text" autoFocus />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  <h3>
                    <FormattedMessage {...messages.tagsList} />
                  </h3>
                </div>
                <div>
                  <Field name="tags" component={TagsInputWrapper} />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  <h3>
                    <FormattedMessage {...messages.keywordsList} />
                  </h3>
                </div>
                <div>
                  <Field name="keywords" component={KeywordsInputWrapper} />
                </div>
              </div>
              {Object.keys(data).length === 0 && (
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
              )}
            </Paper>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        )}
      />
    )
  }
}

CategoryForm.defaultProps = {
  data: {},
}

export default injectIntl(CategoryForm)

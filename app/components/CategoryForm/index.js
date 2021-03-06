import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import Typography from '@material-ui/core/Typography'
import { TextField } from 'final-form-material-ui'
import { OnChange } from 'react-final-form-listeners'
import { FormattedMessage, injectIntl } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import ChipInput from 'components/ChipInput'
import Autosuggest from 'components/Autosuggest'
import AutoSave from 'components/AutoSave'
import messages from './messages'
import tagLabels from './tagsMessages'
import styles from './styles'

const KeywordsInputWrapper = props => <ChipInput {...props} />
const TagsInputWrapper = props => <Autosuggest {...props} suggestions={suggestions} />
let suggestions = []
export class CategoryForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    item: PropTypes.string,
    classes: PropTypes.object.isRequired,
  }

  state = {
    tags: Object.keys(tagLabels)
  }

  componentDidMount() {
    const { intl } = this.props
    const { tags } = this.state
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
    this.forceUpdate()
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
    const { data, item, disabled, role, action, classes } = this.props
    // new category, key empty, edit category, key from item
    const formData = action === 'add' ? { ...data, key: '' } : { ...data, key: item }
    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={formData}
        mutators={{
          replicate: (args, state, utils) => utils.changeValue(state, 'key', () => state.lastFormState.values.text),
        }}
        render={({ handleSubmit, pristine, form, submitting, values }) => (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {action !== 'add' && <AutoSave debounce={1000} save={handleSubmit} />}
            <Paper style={{ padding: 32, margin: 20 }}>
              <IconButton className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
              <div style={{ marginTop: 30 }}>
                <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.key} />
                </Typography>
                <OnChange name="text">
                  {(value, previous) => {
                    if (!values.key || values.key === previous) form.mutators.replicate()
                  }}
                </OnChange>
                <div style={{ maxWidth: '400px' }}>
                  <Field fullWidth name="key" component={TextField} type="text" disabled={action !== 'add'} />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                  <FormattedMessage {...messages.category} />
                </Typography>
                <div style={{ maxWidth: '400px' }}>
                  <Field fullWidth name="text" component={TextField} type="text" autoFocus disabled={disabled} />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                    <FormattedMessage {...messages.tagsList} />
                  </Typography>
                </div>
                <div>
                  <Field name="tags" component={TagsInputWrapper} disabled={role !== 'admin'} />
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                    <FormattedMessage {...messages.keywordsList} />
                  </Typography>
                </div>
                <div>
                  <Field name="keywords" component={KeywordsInputWrapper} disabled={disabled} />
                </div>
              </div>
              {action === 'add' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row-reverse' }}>
                  <Button
                    className={classes.saveButton}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    <FormattedMessage {...messages.save} />
                  </Button>
                  <Button variant="contained" color="secondary" onClick={this.handleClose}>
                    <FormattedMessage {...messages.cancel} />
                  </Button>
                </div>
              )}
            </Paper>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
          </form>
        )}
      />
    )
  }
}

CategoryForm.defaultProps = {
  data: {},
  disabled: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
}

export default withStyles(styles, { withTheme: true })(injectIntl(CategoryForm))

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import { FormattedMessage } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import ChipInput from 'components/ChipInput'
import AutoSave from 'components/AutoSave'
import messages from './messages'

const ChipInputWrapper = props => <ChipInput {...props} text="tag" value="key" />

export class CategoryForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        keywords: PropTypes.arrayOf(PropTypes.string)
      }).isRequired,
    ),
    item: PropTypes.string,
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
    const { data } = this.props
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={data}
          render={({ handleSubmit, pristine, form, submitting, values }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {Object.keys(data).length !== 0 && <AutoSave debounce={1000} save={handleSubmit} />}
              <Paper style={{ padding: 32, margin: 20 }}>
                <IconButton style={{ position: 'absolute', right: '50px' }} onClick={this.handleClose}>
                  <CloseIcon />
                </IconButton>
                <div style={{ marginTop: 30 }}>
                  <h2>
                    <FormattedMessage {...messages.category} />
                  </h2>
                  <div style={{ maxWidth: '271px' }}>
                    <Field fullWidth name="text" component={TextField} type="text" autoFocus />
                  </div>
                </div>
                <div style={{ marginTop: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <h2>
                      <FormattedMessage {...messages.tagsList} />
                    </h2>
                  </div>
                  <div style={{ maxWidth: '400px' }}>
                    <Field name="tags" component={ChipInputWrapper} />
                  </div>
                </div>
                <div style={{ marginTop: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <h2>
                      <FormattedMessage {...messages.keywordsList} />
                    </h2>
                  </div>
                  <div style={{ maxWidth: '400px' }}>
                    <Field name="keywords" component={ChipInputWrapper} />
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
      </div>
    )
  }
}

CategoryForm.defaultProps = {
  data: {},
}

export default CategoryForm

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { TextField, Select } from 'final-form-material-ui'
import MenuItem from '@material-ui/core/MenuItem'
import { FormattedMessage } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import messages from './messages'

// eslint-disable-next-line react/prefer-stateless-function

const isEqualsArray = (a, b) => {
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false

  const isEquals = (item1, item2) => item1 === item2

  for (let i = 0; i < a.length; i++) {
    if (isEquals(a[i], b[i])) return false
  }
  return true
}
export class CategoryForm extends Component {
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
  }

  handleSubmit = values => {
    const { item, onSubmit } = this.props
    onSubmit(values, item)
  }

  render() {
    const { data, menuItems } = this.props
    return (
      <div>
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
            }, // injected from final-form-arrays above
            pristine,
            form,
            submitting,
            values,
          }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Paper style={{ padding: 32, margin: 20 }}>
                <IconButton style={{ position: 'absolute', right: '50px' }} type="cancel">
                  <CloseIcon />
                </IconButton>
                <div style={{ marginTop: 30 }}>
                  <h2>
                    <FormattedMessage {...messages.category} />
                  </h2>
                  <div style={{ maxWidth: '400px' }}>
                    <Field fullWidth name="tag" component={TextField} type="text" />
                  </div>
                </div>
                <div style={{ marginTop: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <h2>
                      <FormattedMessage {...messages.keywordsList} />
                    </h2>
                    {(!values.keywords || !values.keywords.length) && (
                      <Fab
                        style={{ position: 'relative', left: 10, top: -10 }}
                        color="primary"
                        aria-label="Add"
                        onClick={() => push('keywords', undefined)}
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  </div>

                  <FieldArray name="keywords" isEqual={() => isEqualsArray(data.keywords, values.keywords)}>
                    {({ fields }) =>
                      fields.map((keyword, index) => (
                        <div key={keyword} style={{ display: 'flex', marginBottom: 10 }}>
                          <div style={{ width: '400px' }}>
                            <Field fullWidth name={keyword} component={TextField} type="text" />
                          </div>
                          <div>
                            <Button
                              onClick={() => push('keywords', undefined)}
                              variant="fab"
                              mini
                              style={{ marginRight: 10, marginLeft: 10 }}
                              color="primary"
                              aria-label="Add"
                            >
                              <AddIcon />
                            </Button>
                            <Button
                              onClick={() => fields.remove(index)}
                              variant="fab"
                              mini
                              color="primary"
                              aria-label="Add"
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </FieldArray>
                </div>

                <div style={{ marginTop: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <h2>
                      <FormattedMessage {...messages.relatedCategories} />
                    </h2>
                    {(!values.relatedCategories || !values.relatedCategories.length) && (
                      <Fab
                        style={{ position: 'relative', left: 10, top: -10 }}
                        color="primary"
                        aria-label="Add"
                        onClick={() => push('relatedCategories', undefined)}
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  </div>
                  <FieldArray name="relatedCategories">
                    {({ fields }) =>
                      fields.map((relatedCategory, index) => (
                        <div key={relatedCategory} style={{ display: 'flex' }}>
                          <Field style={{ width: '400px' }} name={relatedCategory} component={Select}>
                            {menuItems.map(menuItem => (
                              <MenuItem key={menuItem.key} value={menuItem.key}>
                                {menuItem.tag}
                              </MenuItem>
                            ))}
                          </Field>
                          <div style={{ marginTop: 10 }}>
                            <Button
                              onClick={() => push('relatedCategories', undefined)}
                              variant="fab"
                              mini
                              style={{ marginRight: 10, marginLeft: 10 }}
                              color="primary"
                              aria-label="Add"
                            >
                              <AddIcon />
                            </Button>
                            <Button
                              onClick={() => fields.remove(index)}
                              variant="fab"
                              mini
                              color="primary"
                              aria-label="Add"
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </FieldArray>
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
              </Paper>
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { TextField, Select } from 'final-form-material-ui'
import MenuItem from '@material-ui/core/MenuItem'

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
                <div>
                  <Field fullWidth name="tag" component={TextField} type="text" label="Nombre categoría" />
                </div>
                <div className="buttons">
                  {(!values.keywords || !values.keywords.length) && (
                    <Button
                      variant="contained"
                      style={{ marginTop: 30, marginRight: 10 }}
                      color="primary"
                      onClick={() => push('keywords', undefined)}
                    >
                      Add keywords
                    </Button>
                  )}
                  {(!values.relatedCategories || !values.relatedCategories.length) && (
                    <Button
                      variant="contained"
                      style={{ marginTop: 30 }}
                      color="primary"
                      onClick={() => push('relatedCategories', undefined)}
                    >
                      Add related category
                    </Button>
                  )}
                </div>
                <h2 style={{ marginTop: 40, marginBottom: 20 }}>List of keywords</h2>
                <FieldArray name="keywords" isEqual={() => isEqualsArray(data.keywords, values.keywords)}>
                  {({ fields }) =>
                    fields.map((keyword, index) => (
                      <div key={keyword}>
                        <Field name={keyword} component={TextField} type="text" label={`Keyword #${index + 1}`} />
                        <Button
                          onClick={() => push('keywords', undefined)}
                          variant="fab"
                          mini
                          style={{ marginRight: 10 }}
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
                    ))
                  }
                </FieldArray>
                <h2 style={{ marginTop: 40, marginBottom: 20 }}>Related categories</h2>
                <FieldArray name="relatedCategories">
                  {({ fields }) =>
                    fields.map((relatedCategory, index) => (
                      <div key={relatedCategory}>
                        <Field
                          style={{ width: 300 }}
                          name={relatedCategory}
                          label={`Related category #${index + 1}`}
                          component={Select}
                        >
                          {menuItems.map(menuItem => (
                            <MenuItem key={menuItem.key} value={menuItem.key}>
                              {menuItem.tag}
                            </MenuItem>
                          ))}
                        </Field>
                        <Button
                          onClick={() => push('relatedCategories', undefined)}
                          variant="fab"
                          mini
                          style={{ marginRight: 10 }}
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
                    ))
                  }
                </FieldArray>

                <div style={{ marginTop: 16 }}>
                  <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>
                    Submit
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

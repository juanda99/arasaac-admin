import { defineMessages } from 'react-intl'

export const scope = 'app.components.CategoryForm'

export default defineMessages({
  category: {
    id: `${scope}.category`,
    defaultMessage: 'Category',
  },
  keywordsList: {
    id: `${scope}.keywordsList`,
    defaultMessage: 'List of keywords',
  },
  tagsList: {
    id: `${scope}.keywordsList`,
    defaultMessage: 'List of tags',
  },
  save: {
    id: `${scope}.button.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.button.cancel`,
    defaultMessage: 'Cancel',
  },
})

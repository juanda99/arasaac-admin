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
  relatedCategories: {
    id: `${scope}.relatedCategories`,
    defaultMessage: 'Related categories',
  },
  addRelatedCategory: {
    id: `${scope}.button.addRelatedCategory`,
    defaultMessage: 'Add related category',
  },
  save: {
    id: `${scope}.button.save`,
    defaultMessage: 'Save',
  },
})

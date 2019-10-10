import { defineMessages } from 'react-intl'

export const scope = 'app.components.PictogramForm'

export default defineMessages({
  pictogramData: {
    id: `${scope}.pictogramData`,
    defaultMessage: 'Pictogram data',
  },
  keywordsList: {
    id: `${scope}.keywordsList`,
    defaultMessage: 'Translation',
  },
  categories: {
    id: `${scope}.categories`,
    defaultMessage: 'Categories',
  },
  synsets: {
    id: `${scope}.synsets`,
    defaultMessage: 'Synsets',
  },
  pictogramStatus: {
    id: `${scope}.pictogramStatus`,
    defaultMessage: 'Status',
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

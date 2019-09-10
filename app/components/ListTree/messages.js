import { defineMessages } from 'react-intl'

export const scope = 'app.components.ListTree'

export default defineMessages({
  confirmationTitle: {
    id: `${scope}.categoryDetele.confirmationTitle`,
    defaultMessage: 'Delete category',
  },
  confirmationText: {
    id: `${scope}.categoryDelete.confirmationText`,
    defaultMessage: 'Are you sure you want to delete this category?',
  },
  okButton: {
    id: `${scope}.categoryDelete.okButton`,
    defaultMessage: 'Delete',
  },
  cancelButton: {
    id: `${scope}.categoryDelete.cancelButton`,
    defaultMessage: 'Cancel',
  },
})

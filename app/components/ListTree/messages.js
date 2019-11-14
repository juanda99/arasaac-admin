import { defineMessages } from 'react-intl'

export const scope = 'app.components.ListTree'

export default defineMessages({
  confirmationTitle: {
    id: `${scope}.categoryDetele.confirmationTitle`,
    defaultMessage: 'Delete category',
  },
  confirmationInfoText: {
    id: `${scope}.categoryDelete.confirmationInfoText`,
    defaultMessage: 'Are you sure you want to delete <strong>{category}</strong>?',
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

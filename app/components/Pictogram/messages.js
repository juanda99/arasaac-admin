import { defineMessages } from 'react-intl'

export const scope = 'app.components.Pictogram'

export default defineMessages({
  deletePictogram: {
    id: `${scope}.deletePictogram`,
    defaultMessage: 'Delete pictogram',
  },
  confirmationTitle: {
    id: `${scope}.confirmationTitle`,
    defaultMessage: 'Delete pictogram',
  },
  confirmationInfoText: {
    id: `${scope}.confirmationInfoText`,
    defaultMessage: 'Are you sure you want to delete the pictogram?',
  },
  pictogramPosition: {
    id: `${scope}.pictogramPosition`,
    defaultMessage: 'Pictogram {currentItem} of {totalItems}',
  },
  noKeywords: {
    id: `${scope}.noKeywords`,
    defaultMessage: 'No keywords found!',
  },
})

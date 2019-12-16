import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Pictogram'

export default defineMessages({
  errorTitle: {
    id: `${scope}.errorTitle`,
    defaultMessage: 'Pictogram error',
  },
  loadingPictogram: {
    id: `${scope}.errorTitle`,
    defaultMessage: 'Loading pictogram',
  },
  notFoundPictogram: {
    id: `${scope}.errorTitle`,
    defaultMessage: 'Pictogram not found',
  },
})

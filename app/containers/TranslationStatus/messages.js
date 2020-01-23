import { defineMessages } from 'react-intl'

const scope = 'app.containersTranslationStatus'

export default defineMessages({
  noDataAvailable: {
    id: `${scope}.noDataAvailable`,
    defaultMessage: 'No data available',
  },
  webTransStatus: {
    id: `${scope}.webTransStatus`,
    defaultMessage: 'Web: {webTranslatedString}% ({arasaacTranslated} of {arasaacPhrases})',
  },
  adminWebTransStatus: {
    id: `${scope}.adminWebTransStatus`,
    defaultMessage: 'Administration web: {adminWebTranslatedString}% ({adminTranslated} of {adminPhrases})',
  },
  pictosTransStatus: {
    id: `${scope}.pictosTransStatus`,
    defaultMessage: 'Pictograms: {pictosValidatedString}% ({pictogramsValidated} of {totalPictograms})',
  },
  pictosTransWarning: {
    id: `${scope}.pictosTransWarning`,
    defaultMessage: 'Pictograms may already be translated but not validated',
  },
  updatedInfo: {
    id: `${scope}.updatedInfo`,
    defaultMessage: 'Statistics are updated every hour. Last update: ',
  },
})

/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl'

export const scope = 'app.containers.HomePage'

export default defineMessages({
  translationStatus: {
    id: `${scope}.translationStatus`,
    defaultMessage: 'Translation status',
  },
  download: {
    id: `${scope}.download`,
    defaultMessage: 'Download',
  },
  validate: {
    id: `${scope}.validate`,
    defaultMessage: 'Validate pictograms',
  },
  translateArasaac: {
    id: `${scope}.translateArasaac`,
    defaultMessage: 'Translate ARASAAC Website',
  },
  translateAdmin: {
    id: `${scope}.translateAdmin`,
    defaultMessage: 'Translate Admin Website',
  },
  translatorDocs: {
    id: `${scope}.translatorDocs`,
    defaultMessage: 'Documentation for translators',
  },
  documentation: {
    id: `${scope}.documentation`,
    defaultMessage: 'Documentation',
  },
  pictosTranslation: {
    id: `${scope}.pictosTranslation`,
    defaultMessage: 'Pictograms translation and validation',
  },
  webTranslation: {
    id: `${scope}.webTranslation`,
    defaultMessage: 'Web translation',
  },
  categoryTreeTranslation: {
    id: `${scope}.categoryTreeTranslation`,
    defaultMessage: 'Category tree translation',
  },
})

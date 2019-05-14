import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Pictograms'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Pictograms container!',
  },
  search: {
    id: `${scope}.TabHeader.search`,
    defaultMessage: 'Search',
  },
  pictograms: {
    id: `${scope}.TabHeader.pictograms`,
    defaultMessage: 'Pictograms',
  },
  notPlublished: {
    id: `${scope}.TabHeader.notPublished`,
    defaultMessage: 'Not published',
  },
  notValidated: {
    id: `${scope}.TabHeader.notValidated`,
    defaultMessage: 'Not validated',
  },
  pictogramsNotFound: {
    id: `${scope}.pictogramsNotFound`,
    defaultMessage: 'No pictograms found',
  },
})

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.CatalogsView'

export default defineMessages({
  catalogsManagement: {
    id: `${scope}.h1`,
    defaultMessage: 'Catalogs management',
  },
  totalPictograms: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Total pictograms',
  },
  colorPictograms: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Color pictograms',
  },
  noColorPictograms: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Black and white pictograms',
  },
  variations: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Variations (skin, hair)',
  },
  published: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Published',
  },
  lastBuilt: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Last built',
  },
  language: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Language',
  },
  size: {
    id: `${scope}.tableHeader`,
    defaultMessage: 'Size',
  },
})

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.CatalogsView'

export default defineMessages({
  catalogsManagement: {
    id: `${scope}.h1`,
    defaultMessage: 'Catalogs management',
  },
  totalPictograms: {
    id: `${scope}.tableHeader.totalPictograms`,
    defaultMessage: 'Total pictograms',
  },
  colorPictograms: {
    id: `${scope}.tableHeader.colorPictograms`,
    defaultMessage: 'Color pictograms',
  },
  noColorPictograms: {
    id: `${scope}.tableHeader.noColorPictograms`,
    defaultMessage: 'Black and white pictograms',
  },
  variations: {
    id: `${scope}.tableHeader.variations`,
    defaultMessage: 'Variations (skin, hair)',
  },
  published: {
    id: `${scope}.tableHeader.published`,
    defaultMessage: 'Published',
  },
  lastBuilt: {
    id: `${scope}.tableHeader.lastBuild`,
    defaultMessage: 'Last built',
  },
  language: {
    id: `${scope}.tableHeader.language`,
    defaultMessage: 'Language',
  },
  size: {
    id: `${scope}.tableHeader.size`,
    defaultMessage: 'Size',
  },
  gettingData: {
    id: `${scope}.progressBuild.gettingData`,
    defaultMessage: 'Getting pictogram data from database',
  },
  gettingPictos: {
    id: `${scope}.progressBuild.gettingPictos`,
    defaultMessage: 'Getting pictogram files: {extraInfo}',
  },
  compressingFiles: {
    id: `${scope}.progressBuild.compressingFiles`,
    defaultMessage: 'Compressing pictogram files {extraInfo}',
  },
  files: {
    id: `${scope}.progressBuild.files`,
    defaultMessage: 'files',
  },
  calculatingSize: {
    id: `${scope}.progressBuild.calculatingSize`,
    defaultMessage: 'Calculating size...',
  },
  updatingCatalog: {
    id: `${scope}.progressBuild.updatingCatalog`,
    defaultMessage: 'Uploading catalog for publishing: {info}',
  },
  connectingServer: {
    id: `${scope}.progressBuild.connectingServer`,
    defaultMessage: 'Connecting to public server...',
  },
  createdCatalog: {
    id: `${scope}.progressBuild.createdCatalog`,
    defaultMessage: 'Created catalog in {info} seconds',
  },
  updatingData: {
    id: `${scope}.progressBuild.updatingData`,
    defaultMessage: 'Updating catalog data in database',
  },
  never: {
    id: `${scope}.lastBuild.never`,
    defaultMessage: 'Never',
  },
})

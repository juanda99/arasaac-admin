/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl'

export const scope = 'app.containers.AddPictograms'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddPictograms container!',
  },
  addFiles: {
    id: `${scope}.addFiles`,
    defaultMessage: 'Add pictogram files',
  },
  uploadPictograms: {
    id: `${scope}.uploadPictograms`,
    defaultMessage: 'Upload pictograms',
  },
})

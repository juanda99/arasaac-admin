/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl'

export const scope = 'app.containers.AddPictograms'

export default defineMessages({
  errorUploading: {
    id: `${scope}.errorUploading`,
    defaultMessage: 'Uppps, pictograms were not uploaded!',
  },
  successUploading: {
    id: `${scope}.successUploading`,
    defaultMessage: 'Pictograms have been uploaded',
  },
  uploadMoreFiles: {
    id: `${scope}.uploadMoreFiles`,
    defaultMessage: 'Upload more pictograms',
  },
})

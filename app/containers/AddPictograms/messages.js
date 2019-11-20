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
    defaultMessage: 'Uppps, files were not uploaded!',
  },
  successUploading: {
    id: `${scope}.successUploading`,
    defaultMessage: 'Files has been uploaded',
  },
  uploadMoreFiles: {
    id: `${scope}.uploadMoreFiles`,
    defaultMessage: 'Upload more files',
  },
})

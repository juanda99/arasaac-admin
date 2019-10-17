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
})

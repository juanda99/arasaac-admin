/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Categories'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Categories',
  },
  errorTitle: {
    id: `${scope}.errorTitle`,
    defaultMessage: 'Category error',
  },
})

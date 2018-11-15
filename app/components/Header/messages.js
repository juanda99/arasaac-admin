import { defineMessages } from 'react-intl'

export const scope = 'app.components.Header'

export default defineMessages({
  changeLanguage: {
    id: `${scope}.button.changeLanguage`,
    defaultMessage: 'Change language',
  },
  userMenu: {
    id: `${scope}.button.userMenu`,
    defaultMessage: 'User menu',
  },
})

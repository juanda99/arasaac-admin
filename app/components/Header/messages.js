import { defineMessages } from 'react-intl'

export const scope = 'app.components.Header'

export default defineMessages({
  userMenu: {
    id: `${scope}.button.userMenu`,
    defaultMessage: 'User menu',
  },
  signin: {
    id: `${scope}.menu.signin`,
    defaultMessage: 'Sign in',
  },
})

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Users'

export default defineMessages({
  // TODO: remove header message or send it to navbar
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Users management',
  },
  users: {
    id: `${scope}.TabHeader.users`,
    defaultMessage: 'Users',
  },
  usersNotValidated: {
    id: `${scope}.TabHeader.usersNotValidated`,
    defaultMessage: 'Users not validated',
  },
})

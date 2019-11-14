import { defineMessages } from 'react-intl'

export const scope = 'app.components.Header'

export default defineMessages({
  userMenu: {
    id: `${scope}.button.userMenu`,
    defaultMessage: 'User menu',
  },
  // sigin also used for title
  signin: {
    id: `${scope}.menu.signin`,
    defaultMessage: 'Sign in',
  },
  addPictograms: {
    id: `${scope}.title.addPictograms`,
    defaultMessage: 'Add pictogram',
  },
  pictograms: {
    id: `${scope}.title.pictograms`,
    defaultMessage: 'Pictograms',
  },
  categories: {
    id: `${scope}.title.categories`,
    defaultMessage: 'Categories',
  },
  catalogs: {
    id: `${scope}.title.catalogs`,
    defaultMessage: 'Catalos',
  },
  management: {
    id: `${scope}.title.management`,
    defaultMessage: 'Management',
  },
  users: {
    id: `${scope}.title.users`,
    defaultMessage: 'Users',
  },
})

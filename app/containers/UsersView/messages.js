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
  noData: {
    id: `${scope}.tableMessages.noData`,
    defaultMessage: 'Data not found',
  },
  filterPlaceholder: {
    id: `${scope}.filterRowMessages.filterPlaceholder`,
    defaultMessage: 'Filter...',
  },
  showAll: {
    id: `${scope}.pagingPanelMessages.showAll`,
    defaultMessage: 'All',
  },
  rowsPerPage: {
    id: `${scope}.pagingPanelMessages.rowsPerPage`,
    defaultMessage: 'Rows per page',
  },
  info: {
    id: `${scope}.pagingPanelMessages.info`,
    // eslint-disable-next-line
    defaultMessage: '\\{from\\}-\\{to\\} de \\{count\\}',
  },
  name: {
    id: `${scope}.gridCaption.name`,
    defaultMessage: 'Name',
  },
  email: {
    id: `${scope}.gridCaption.email`,
    defaultMessage: 'Email',
  },
  role: {
    id: `${scope}.gridCaption.role`,
    defaultMessage: 'Role',
  },
  locale: {
    id: `${scope}.gridCaption.locale`,
    defaultMessage: 'Locale',
  },
  url: {
    id: `${scope}.gridCaption.url`,
    defaultMessage: 'Url',
  },
  company: {
    id: `${scope}.gridCaption.company`,
    defaultMessage: 'Company',
  },
})

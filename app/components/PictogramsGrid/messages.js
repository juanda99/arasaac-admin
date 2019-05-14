import { defineMessages } from 'react-intl'

export const scope = 'app.components.PictogramsGrid'

export default defineMessages({
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
  published: {
    id: `${scope}.gridCaption.published`,
    defaultMessage: 'Published',
  },
  validated: {
    id: `${scope}.gridCaption.Validated`,
    defaultMessage: 'Validated',
  },
  created: {
    id: `${scope}.gridCaption.created`,
    defaultMessage: 'Creation date',
  },
  lastUpdated: {
    id: `${scope}.gridCaption.lastUpdated`,
    defaultMessage: 'Updated',
  },
  identifier: {
    id: `${scope}.gridCaption.identifier`,
    defaultMessage: 'Identifier',
  },
})

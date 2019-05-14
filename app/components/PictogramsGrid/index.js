import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import {
  PagingState,
  SortingState,
  IntegratedSorting,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
  RowDetailState,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableFilterRow,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui'
import { injectIntl, intlShape, FormattedTime, FormattedDate } from 'react-intl'
import history from 'utils/history'
import View from 'components/View'
import PublishedIcon from '@material-ui/icons/Done'
import messages from './messages'

const TableRow = ({ row, ...restProps }) => (
  // eslint-disable-next-line no-underscore-dangle
  <Table.Row
    {...restProps}
    key={row._id}
    onClick={() => history.push(`/pictograms/${row._id}`)}
    style={{ cursor: 'pointer' }}
  />
)

const isValidDate = d => d instanceof Date && !isNaN(d)

const DateFormatter = ({ value, row }) => {
  const date = new Date(value)
  if (!isValidDate(date)) return <span>?</span>
  return (
    <span>
      {' '}
      <FormattedDate value={date} /> <FormattedTime value={date} />{' '}
    </span>
  )
}
const NumericFormatter = ({ value }) => <p style={{ textAlign: 'center' }}>{value}</p>
const DoneFormatter = ({ value }) => (value ? <PublishedIcon /> : '')
const ImageFormatter = ({ value }) =>
  value ? (
    <img
      src={`https://static.arasaac.org/pictograms/${value}/${value}_300.png`}
      style={{ width: '80px', height: '80px' }}
      alt={value}
    />
  ) : (
    ''
  )

ImageFormatter.propTypes = {
  value: PropTypes.number.isRequired,
}
DoneFormatter.propTypes = {
  value: PropTypes.number.isRequired,
}
NumericFormatter.propTypes = {
  value: PropTypes.number.isRequired,
}

const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />
const NumericTypeProvider = props => <DataTypeProvider formatterComponent={NumericFormatter} {...props} />
const DoneTypeProvider = props => <DataTypeProvider formatterComponent={DoneFormatter} {...props} />
const ImageTypeProvider = props => <DataTypeProvider formatterComponent={ImageFormatter} {...props} />

class PictogramsGrid extends React.PureComponent {
  state = {
    columns: [
      { name: 'idPictogram', title: this.props.intl.formatMessage(messages.identifier) },
      { name: '_id', title: 'id' },
      { name: 'status', title: this.props.intl.formatMessage(messages.published) },
      { name: 'validated', title: this.props.intl.formatMessage(messages.validated) },
      { name: 'created', title: this.props.intl.formatMessage(messages.created) },
      { name: 'lastUpdated', title: this.props.intl.formatMessage(messages.lastUpdated) },
      { name: 'license', title: 'Show more...' },
    ],
    pageSizes: [10, 20, 100],
    pageSize: 10,
    currentPage: 0,
    sorting: [{ columnName: 'idPictogram', direction: 'desc' }],
    filters: [],
    tableColumnExtensions: [{ columnName: '_id', width: 0 }],
    dateColumns: ['lastUpdated', 'created'],
    doneColumns: ['status'],
    numberColumns: ['validated'],
    imageColumns: ['idPictogram'],
  }

  RowDetail = ({ row }) => {
    const keywords = row.keywords.map(keyword => (
      <p>
        <b>{keyword.keyword}</b>
      </p>
    ))

    return <div>{keywords}</div>
  }

  tableMessages = {
    noData: this.props.intl.formatMessage(messages.noData),
  }

  filterRowMessages = {
    filterPlaceholder: this.props.intl.formatMessage(messages.filterPlaceholder),
  }

  pagingPanelMessages = {
    showAll: this.props.intl.formatMessage(messages.showAll),
    rowsPerPage: this.props.intl.formatMessage(messages.rowsPerPage),
    info: this.props.intl.formatMessage(messages.info),
  }

  changeCurrentPage = currentPage => this.setState({ currentPage })

  changePageSize = pageSize => this.setState({ pageSize })

  changeSorting = sorting => this.setState({ sorting })

  changeFilters = filters => this.setState({ filters })

  render() {
    // const users = this.props.users.slice(0, 100)
    const {
      columns,
      pageSizes,
      currentPage,
      pageSize,
      sorting,
      filters,
      tableColumnExtensions,
      dateColumns,
      numberColumns,
      doneColumns,
      imageColumns,
    } = this.state
    return (
      <div>
        <View>
          <h1>Lista de pictogramas</h1>
        </View>
        <Paper style={{ position: 'relative' }}>
          <Grid rows={this.props.pictograms} columns={columns} style={{ padding: '10px' }}>
            <FilteringState filters={filters} onFiltersChange={this.changeFilters} />
            <IntegratedFiltering />
            <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
            <IntegratedSorting />
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <IntegratedPaging />
            <DateTypeProvider for={dateColumns} complete />
            <NumericTypeProvider for={numberColumns} />
            <DoneTypeProvider for={doneColumns} />
            <ImageTypeProvider for={imageColumns} />
            <RowDetailState />
            <Table rowComponent={TableRow} columnExtensions={tableColumnExtensions} messages={this.tableMessages} />
            <TableHeaderRow showSortingControls />
            <TableRowDetail contentComponent={this.RowDetail} />
            <TableFilterRow messages={this.filterRowMessages} />
            <PagingPanel pageSizes={pageSizes} messages={this.pagingPanelMessages} />
          </Grid>
        </Paper>
      </div>
    )
  }
}

PictogramsGrid.propTypes = {
  pictograms: PropTypes.arrayOf(PropTypes.object),
  intl: intlShape.isRequired,
}

export default injectIntl(PictogramsGrid)

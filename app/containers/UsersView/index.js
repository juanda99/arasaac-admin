import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import {
  PagingState,
  SortingState,
  IntegratedSorting,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, PagingPanel, TableFilterRow } from '@devexpress/dx-react-grid-material-ui'
import { injectIntl, intlShape } from 'react-intl'
import history from 'utils/history'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import CircularProgress from '@material-ui/core/CircularProgress'
import reducer from './reducer'
import saga from './sagas'
import { makeLoadingSelector, makeArrayUsersSelector, makeSelectHasUser } from './selectors'
import { users } from './actions'
import messages from './messages'

const TableRow = ({ row, ...restProps }) => (
  // eslint-disable-next-line no-underscore-dangle
  <Table.Row {...restProps} onClick={() => history.push(`/users/${row._id}`)} style={{ cursor: 'pointer' }} />
)

class UsersView extends React.PureComponent {
  state = {
    columns: [
      { name: '_id', title: 'id' },
      { name: 'name', title: this.props.intl.formatMessage(messages.name) },
      { name: 'email', title: this.props.intl.formatMessage(messages.email) },
      { name: 'role', title: this.props.intl.formatMessage(messages.role) },
      { name: 'locale', title: this.props.intl.formatMessage(messages.locale) },
      { name: 'company', title: this.props.intl.formatMessage(messages.company) },
      { name: 'url', title: this.props.intl.formatMessage(messages.url) },
    ],
    pageSizes: [10, 20, 100],
    pageSize: parseInt(sessionStorage.getItem('usersPageSize'), 10) || 10,
    currentPage: parseInt(sessionStorage.getItem('usersCurrentPage'), 10) || 0,
    sorting: JSON.parse(sessionStorage.getItem('usersSorting')) || [{ columnName: 'name', direction: 'asc' }],
    filters: JSON.parse(sessionStorage.getItem('usersFilters')) || [],
    tableColumnExtensions: [{ columnName: '_id', width: 0 }],
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

  componentDidMount = () => {
    const { requestUsers, token } = this.props
    requestUsers(token)
  }

  componentDidUpdate() {
    // load Data
  }

  changeCurrentPage = currentPage => {
    this.setState({ currentPage })
    sessionStorage.setItem('usersCurrentPage', currentPage)
  }

  changePageSize = pageSize => {
    this.setState({ pageSize })
    sessionStorage.setItem('usersPageSize', pageSize)
  }

  changeSorting = sorting => {
    this.setState({ sorting })
    sessionStorage.setItem('usersSorting', JSON.stringify(sorting))
  }

  changeFilters = filters => {
    this.setState({ filters })
    sessionStorage.setItem('usersFilters', JSON.stringify(filters))
  }

  render() {
    const { loading } = this.props
    // const users = this.props.users.slice(0, 100)
    const { columns, pageSizes, currentPage, pageSize, sorting, filters, tableColumnExtensions } = this.state
    return (
      <div>
        <Paper style={{ position: 'relative' }}>
          {loading ? (
            <div style={{ position: 'relative' }}>
              <CircularProgress style={{ position: 'absolute', top: '10%', left: '10%' }} />
              <p>Getting data...</p>
            </div>
          ) : (
            <Grid rows={this.props.users} columns={columns} style={{ padding: '10px' }}>
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
              <Table rowComponent={TableRow} columnExtensions={tableColumnExtensions} messages={this.tableMessages} />
              <TableHeaderRow showSortingControls />
              <TableFilterRow messages={this.filterRowMessages} />
              <PagingPanel pageSizes={pageSizes} messages={this.pagingPanelMessages} />
            </Grid>
          )}
        </Paper>
      </div>
    )
  }
}

UsersView.propTypes = {
  requestUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  token: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  loading: makeLoadingSelector()(state),
  users: makeArrayUsersSelector()(state),
  token: makeSelectHasUser()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: token => {
    dispatch(users.request(token))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'usersView', reducer })
const withSaga = injectSaga({ key: 'usersView', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(UsersView))

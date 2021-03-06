import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
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
import { injectIntl } from 'react-intl'
import history from 'utils/history'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeSelectHasUser } from 'containers/App/selectors'
import reducer from './reducer'
import saga from './sagas'
import { makeLoadingSelector, makeUpdatedSelector, makeArrayUsersSelector } from './selectors'
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
    pageSizes: [50, 100, 200, 500],
    pageSize: parseInt(sessionStorage.getItem('usersPageSize'), 10) || 100,
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



  componentDidMount = () => {
    const { requestUsers, token, updated, loading } = this.props
    requestUsers(updated, token)
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
    // const pagingPanelMessages = {
    //   showAll: this.props.intl.formatMessage(messages.showAll),
    //   rowsPerPage: this.props.intl.formatMessage(messages.rowsPerPage),
    //   info2: this.props.intl.formatMessage(messages.info, { from: this.state.pageSize * this.state.currentPage, to: this.state.pageSize * this.state.currentPage + this.state.pageSize, count: this.props.users.length }),
    //   info: (data) => {
    //     const { from, to, count } = data
    //     console.log(from, to, count)
    //     return this.props.intl.formatMessage(messages.info, { from, to, count })
    //   },
    // }
    // const users = this.props.users.slice(0, 100)
    const { columns, pageSizes, currentPage, pageSize, sorting, filters, tableColumnExtensions } = this.state
    return (
      <View>
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
                  defaultCurrentPage={0}
                  defaultPageSize={100}
                />
                <IntegratedPaging />
                <Table rowComponent={TableRow} columnExtensions={tableColumnExtensions} messages={this.tableMessages} />
                <TableHeaderRow showSortingControls />
                <TableFilterRow messages={this.filterRowMessages} />
                {/* <PagingPanel pageSizes={pageSizes} messages={pagingPanelMessages} /> */}
                <PagingPanel pageSizes={pageSizes} />
              </Grid>
            )}
        </Paper>
      </View>
    )
  }
}

UsersView.propTypes = {
  requestUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  updated: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
}

const mapStateToProps = state => ({
  loading: makeLoadingSelector()(state),
  users: makeArrayUsersSelector()(state),
  token: makeSelectHasUser()(state),
  updated: makeUpdatedSelector()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: (updated, token) => {
    dispatch(users.request(updated, token))
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

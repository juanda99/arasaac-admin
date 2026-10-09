import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
import Paper from '@material-ui/core/Paper'
import { PagingState, CustomPaging, SortingState, SearchState } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, PagingPanel, Toolbar, SearchPanel } from '@devexpress/dx-react-grid-material-ui'
import { injectIntl } from 'react-intl'
import history from 'utils/history'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeSelectHasUser } from 'containers/App/selectors'
import reducer from './reducer'
import saga from './sagas'
import { makeLoadingSelector, makeTotalSelector, makeArrayUsersSelector } from './selectors'
import { users } from './actions'
import messages from './messages'

const TableRow = ({ row, ...restProps }) => (
  // eslint-disable-next-line no-underscore-dangle
  <Table.Row {...restProps} onClick={() => history.push(`/users/${row._id}`)} style={{ cursor: 'pointer' }} />
)

export class UsersView extends React.PureComponent {
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
    pageSizes: [25, 50, 100, 200],
    pageSize: parseInt(sessionStorage.getItem('usersPageSize'), 10) || 50,
    currentPage: parseInt(sessionStorage.getItem('usersCurrentPage'), 10) || 0,
    sorting: JSON.parse(sessionStorage.getItem('usersSorting')) || [{ columnName: 'name', direction: 'asc' }],
    searchValue: sessionStorage.getItem('usersSearch') || '',
    tableColumnExtensions: [{ columnName: '_id', width: 0 }],
  }

  tableMessages = {
    noData: this.props.intl.formatMessage(messages.noData),
  }

  componentDidMount = () => {
    this.loadUsers()
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimer)
  }

  loadUsers = (overrideState = {}) => {
    const { currentPage, pageSize, sorting, searchValue } = { ...this.state, ...overrideState }
    const { requestUsers, token } = this.props
    const sort = sorting[0] ? sorting[0].columnName : 'name'
    const direction = sorting[0] ? sorting[0].direction : 'asc'
    requestUsers(
      {
        page: currentPage + 1,
        pageSize,
        search: searchValue,
        sort,
        direction,
      },
      token,
    )
  }

  changeCurrentPage = currentPage => {
    this.setState({ currentPage })
    sessionStorage.setItem('usersCurrentPage', currentPage)
    this.loadUsers({ currentPage })
  }

  changePageSize = pageSize => {
    this.setState({ pageSize, currentPage: 0 })
    sessionStorage.setItem('usersPageSize', pageSize)
    sessionStorage.setItem('usersCurrentPage', 0)
    this.loadUsers({ pageSize, currentPage: 0 })
  }

  changeSorting = sorting => {
    this.setState({ sorting, currentPage: 0 })
    sessionStorage.setItem('usersSorting', JSON.stringify(sorting))
    sessionStorage.setItem('usersCurrentPage', 0)
    this.loadUsers({ sorting, currentPage: 0 })
  }

  changeSearchValue = searchValue => {
    this.setState({ searchValue, currentPage: 0 })
    sessionStorage.setItem('usersSearch', searchValue)
    sessionStorage.setItem('usersCurrentPage', 0)
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.loadUsers({ searchValue, currentPage: 0 })
    }, 400)
  }

  render() {
    const { loading, users: rows, total } = this.props
    const { columns, pageSizes, currentPage, pageSize, sorting, searchValue, tableColumnExtensions } = this.state
    const searchPanelMessages = {
      searchPlaceholder: this.props.intl.formatMessage(messages.searchPlaceholder),
    }

    return (
      <View>
        <Paper style={{ position: 'relative', minHeight: 400 }}>
          <Grid rows={rows} columns={columns} style={{ padding: '10px' }}>
            <SearchState value={searchValue} onValueChange={this.changeSearchValue} />
            <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <CustomPaging totalCount={total} />
            <Table rowComponent={TableRow} columnExtensions={tableColumnExtensions} messages={this.tableMessages} />
            <TableHeaderRow showSortingControls />
            <Toolbar />
            <SearchPanel messages={searchPanelMessages} />
            <PagingPanel pageSizes={pageSizes} />
          </Grid>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Paper>
      </View>
    )
  }
}

UsersView.propTypes = {
  requestUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
}

UsersView.defaultProps = {
  users: [],
  total: 0,
}

const mapStateToProps = state => ({
  loading: makeLoadingSelector()(state),
  total: makeTotalSelector()(state),
  users: makeArrayUsersSelector()(state),
  token: makeSelectHasUser()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: (params, token) => {
    dispatch(users.request(params, token))
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

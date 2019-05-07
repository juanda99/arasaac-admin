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
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import GroupIcon from '@material-ui/icons/Group'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import history from 'utils/history'
import View from 'components/View'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import saga from './sagas'
import { makeLoadingSelector, makeArrayUsersSelector, makeTempUsersSelector, makeSelectHasUser } from './selectors'
import { users, tempUsers } from './actions'
import styles from './styles'
import messages from './messages'

const TableRow = ({ row, ...restProps }) => (
  // eslint-disable-next-line no-underscore-dangle
  <Table.Row {...restProps} onClick={() => history.push(`/users/${row._id}}`)} style={{ cursor: 'pointer' }} />
)

class UsersView extends React.PureComponent {
  state = {
    slideIndex: 0,
    columns: [
      { name: '_id', title: 'id' },
      { name: 'name', title: this.props.intl.formatMessage(messages.name) },
      { name: 'email', title: this.props.intl.formatMessage(messages.email) },
      { name: 'role', title: this.props.intl.formatMessage(messages.role) },
      { name: 'locale', title: this.props.intl.formatMessage(messages.locale) },
      { name: 'url', title: this.props.intl.formatMessage(messages.url) },
      { name: 'company', title: this.props.intl.formatMessage(messages.company) },
    ],
    pageSizes: [10, 20, 100],
    pageSize: 10,
    currentPage: 0,
    sorting: [{ columnName: 'name', direction: 'asc' }],
    filters: [],
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

  changeCurrentPage = currentPage => this.setState({ currentPage })

  changePageSize = pageSize => this.setState({ pageSize })

  changeSorting = sorting => this.setState({ sorting })

  changeFilters = filters => this.setState({ filters })

  render() {
    const { classes, width } = this.props
    // const users = this.props.users.slice(0, 100)
    const {
      slideIndex,
      columns,
      pageSizes,
      currentPage,
      pageSize,
      sorting,
      filters,
      tableColumnExtensions,
    } = this.state
    return (
      <div className={classes.root}>
        <Tabs
          className={classes.tab}
          fullWidth
          value={slideIndex}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={width === 'xs' ? '' : <FormattedMessage {...messages.users} />} icon={<GroupIcon />} value={0} />
          <Tab
            label={width === 'xs' ? '' : <FormattedMessage {...messages.usersNotValidated} />}
            icon={<GroupAddIcon />}
            value={1}
          />
        </Tabs>
        {slideIndex === 0 && (
          <View>
            <Paper style={{ position: 'relative' }}>
              <Grid rows={this.props.users} columns={columns}>
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
            </Paper>
          </View>
        )}
        {slideIndex === 1 && <View>Item Two</View>}
        {slideIndex === 2 && <View>Item Three</View>}
      </div>
    )
  }
}

UsersView.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  requestUsers: PropTypes.func.isRequired,
  requestTempUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
  tempUsers: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
}

const mapStateToProps = state => ({
  loading: makeLoadingSelector()(state),
  users: makeArrayUsersSelector()(state),
  tempUsers: makeTempUsersSelector()(state),
  token: makeSelectHasUser()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: token => {
    dispatch(users.request(token))
  },
  requestTempUsers: () => {
    dispatch(tempUsers.request())
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
)(withStyles(styles, { withTheme: true })(withWidth()(injectIntl(UsersView))))

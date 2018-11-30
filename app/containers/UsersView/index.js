import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { PagingState, SortingState, CustomPaging } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import GroupIcon from '@material-ui/icons/Group'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import saga from './sagas'
import { makeLoadingSelector, makeUsersSelector, makeTempUsersSelector } from './selectors'
import { users, tempUsers } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class UsersView extends React.PureComponent {
  state = {
    slideIndex: 0,
    columns: [
      { name: 'name', title: 'Name' },
      { name: 'email', title: 'Email' },
      { name: 'role', title: 'Role' },
      { name: 'locale', title: 'Locale' },
      { name: 'url', title: 'Url' },
      { name: 'company', title: 'Company' },
    ],
    sorting: [{ columnName: 'name', direction: 'asc' }],
    totalCount: 0,
    pageSize: 10,
    pageSizes: [5, 10, 15],
    currentPage: 0,
    loading: true,
  }

  componentDidMount = () => {
    const { requestUsers } = this.props
    requestUsers()
  }

  componentDidUpdate() {
    // load Data
  }

  changeSorting(sorting) {
    this.setState({
      loading: true,
      sorting,
    })
  }

  changeCurrentPage(currentPage) {
    this.setState({
      loading: true,
      currentPage,
    })
  }

  changePageSize(pageSize) {
    const { totalCount, currentPage: stateCurrentPage } = this.state
    const totalPages = Math.ceil(totalCount / pageSize)
    const currentPage = Math.min(stateCurrentPage, totalPages - 1)

    this.setState({
      loading: true,
      pageSize,
      currentPage,
    })
  }

  render() {
    const { classes, width } = this.props
    console.log(this.props.users)
    const users = this.props.users.slice(0, 100)
    const { slideIndex, columns, sorting, pageSize, pageSizes, currentPage, totalCount, loading } = this.state
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
              <Grid rows={users} columns={columns}>
                <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
                <PagingState
                  currentPage={currentPage}
                  onCurrentPageChange={this.changeCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={this.changePageSize}
                />
                <CustomPaging totalCount={totalCount} />
                <Table />
                <TableHeaderRow showSortingControls />
                <PagingPanel pageSizes={pageSizes} />
              </Grid>
              {loading && <p style={{ position: 'absolute', top: '50%', left: '50%' }}>Cargando....</p>}
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
}

const mapStateToProps = state => ({
  loading: makeLoadingSelector()(state),
  users: makeUsersSelector()(state),
  tempUsers: makeTempUsersSelector()(state),
})

const mapDispatchToProps = dispatch => ({
  requestUsers: () => {
    dispatch(users.request())
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
)(withStyles(styles, { withTheme: true })(withWidth()(UsersView)))

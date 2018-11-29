import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import GroupIcon from '@material-ui/icons/Group'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import { FormattedMessage } from 'react-intl'
import MUIDataTable from 'mui-datatables'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import View from 'components/View'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import saga from './sagas'
import Cities from './cities'
import { makeLoadingSelector, makeUsersSelector, makeTempUsersSelector } from './selectors'
import { users, tempUsers } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class UsersView extends React.PureComponent {
  state = {
    slideIndex: 0,
  }

  columns = [
    {
      name: 'Name',
      options: {
        filter: false,
      },
    },
    {
      name: 'Title',
      options: {
        filter: true,
      },
    },
    {
      name: 'Location',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <Cities value={value} index={tableMeta.columnIndex} change={event => updateValue(event)} />
        ),
      },
    },
    {
      name: 'Age',
      options: {
        filter: false,
      },
    },
    {
      name: 'Salary',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const nf = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })

          return nf.format(value)
        },
      },
    },
    {
      name: 'Active',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <FormControlLabel
            label={value ? 'Yes' : 'No'}
            value={value ? 'Yes' : 'No'}
            control={<Switch color="primary" checked={value} value={value ? 'Yes' : 'No'} />}
            onChange={event => {
              updateValue(event.target.value !== 'Yes')
            }}
          />
        ),
      },
    },
  ]

  data = [
    ['Robin Duncan', 'Business Analyst', 'Los Angeles', 20, 77000, false],
    ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, 135000, true],
    ['Harper White', 'Attorney', 'Pittsburgh', 52, 420000, false],
    ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, 150000, true],
    ['Frankie Long', 'Industrial Analyst', 'Austin', 31, 170000, false],
    ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, 90000, true],
    ['Justice Mann', 'Business Consultant', 'Chicago', 24, 133000, false],
    ['Addison Navarro', 'Business Management Analyst', 'New York', 50, 295000, true],
    ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000, false],
    ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000, true],
    ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000, false],
    ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000, true],
    ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000, false],
    ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000, true],
    ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000, false],
    ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000, true],
    ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000, false],
    ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000, true],
    ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000, false],
    ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000, true],
    ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000, false],
    ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000, true],
  ]

  options = {
    // filterType: 'checkbox',
    filterType: 'dropdown',
    responsive: 'scroll',
    selectableRows: true,
  }

  render() {
    const { classes, width } = this.props
    const { slideIndex } = this.state
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
            <h1>
              <FormattedMessage {...messages.header} />
            </h1>
            <MUIDataTable title="Employee List" data={this.data} columns={this.columns} options={this.options} />
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

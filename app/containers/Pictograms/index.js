import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withWidth, { SMALL } from '@material-ui/core/withWidth'
import SearchIcon from '@material-ui/icons/Search'
import VisibilityIcon from '@material-ui/icons/VisibilityOff'
import ValidateIcon from '@material-ui/icons/ThumbDown'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { FormattedMessage } from 'react-intl'
import TabContainer from 'components/TabContainer'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class Pictograms extends React.PureComponent {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes, width } = this.props
    const { value } = this.state
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.search} />}
              icon={<SearchIcon />}
              value={0}
            />
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.notPlublished} />}
              icon={<VisibilityIcon />}
              value={1}
            />
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.notValidated} />}
              icon={<ValidateIcon />}
              value={1}
            />
          </Tabs>
          {value === 0 && <TabContainer>Item One</TabContainer>}
          {value === 1 && <TabContainer>Item Two</TabContainer>}
          {value === 2 && <TabContainer>Item Three</TabContainer>}
        </div>
      </React.Fragment>
    )
  }
}

Pictograms.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
}

export default withStyles(styles, { withTheme: true })(withWidth()(Pictograms))

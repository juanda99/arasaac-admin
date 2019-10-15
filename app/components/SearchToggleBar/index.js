import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ViewListIcon from '@material-ui/icons/List'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const styles = theme => ({
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing(1)}px 0`,
    background: theme.palette.background.default,
  },
})

class ToggleButtons extends React.Component {
  handleViewType = (event, viewType) => this.props.changeViewType(viewType)

  render() {
    const { classes, viewType } = this.props

    return (
      <div className={classes.toggleContainer}>
        <ToggleButtonGroup value={viewType} exclusive onChange={this.handleViewType}>
          <ToggleButton value="list">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="module">
            <ViewModuleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  }
}

ToggleButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  viewType: PropTypes.string.isRequired,
  changeViewType: PropTypes.func.isRequired,
}

export default withStyles(styles)(ToggleButtons)

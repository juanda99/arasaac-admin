import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@material-ui/core/LinearProgress'
import Divider from '@material-ui/core/Divider'
import BuildIcon from '@material-ui/icons/Build'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
})

export class Catalog extends PureComponent {
  stepInfo = (step, info, complete) => {
    let extraInfo
    switch (step) {
      case 1:
        return 'Getting pictogram data from database'
      case 2:
        extraInfo = info ? `(${info} files)` : '(0 files)'
        return `Getting pictogram files ${extraInfo}`
      case 3:
        extraInfo = info ? `(${info})` : '(Calculating size...)'
        return `Compressing pictogram files ${extraInfo}`
      case 4:
        return info ? `(Uploading catalog for publishing: ${info})` : '(Connecting to public server...)'
      case 5:
        return complete === 100 ? `Created catalog in ${info} seconds` : 'Updating catalog data in database'
      default:
        return ''
    }
  }

  render() {
    const { catalog, catalogStatus, classes } = this.props
    // values provided from api call and sockets:
    const { status, lastUpdated, colorPictograms, noColorPictograms, variations } = catalogData
    const { step, info, complete, err } = catalogStatus

    const downloadStatus = complete ? (
      <div>
        <p>{this.stepInfo(step, info, complete)}</p>
        <LinearProgress variant="determinate" value={complete} />
      </div>
    ) : (
      <Button variant="contained" color="primary" className={classes.button}>
        Send
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
        <BuildIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
      </Button>
    )

    return (
      <div>
        <h2>Catalog for language {catalog.language}</h2>
        {downloadStatus}
        <Divider />
      </div>
    )
  }
}

Catalog.propTypes = {
  catalog: PropTypes.object,
  catalogStatus: PropTypes.object,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Catalog)

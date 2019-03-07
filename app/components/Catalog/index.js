import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@material-ui/core/LinearProgress'
import Divider from '@material-ui/core/Divider'
import BuildIcon from '@material-ui/icons/Build'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import messages from './messages'

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

let id = 0
const createData = (desc, colorPictograms, noColorPictograms, variations) => {
  id += 1
  const totalPictograms = colorPictograms + noColorPictograms + variations
  return { id, totalPictograms, colorPictograms, noColorPictograms, variations }
}

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
    const { status, lastUpdated, language, colorPictograms, noColorPictograms, variations } = catalog
    const { step, info, complete/*, err*/ } = catalogStatus
    const rows = [createData(colorPictograms, noColorPictograms, variations)]
    const downloadStatus = complete ? (
      <div>
        <p>{this.stepInfo(step, info, complete)}</p>
        <LinearProgress variant="determinate" value={complete} />
      </div>
    ) : (
      <Button variant="contained" color="primary" className={classes.button}>
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
        <BuildIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
        Build
      </Button>
    )

    return (
      <div>
        <h2>
          <FormattedMessage {...messages.catalogGeneration} values={{ language }} />
        </h2>

        <p>Last build: {lastUpdated}</p>
        <p>Status: {status ? 'Published' : 'Not published'}</p>
        {downloadStatus}
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">Total pictograms</TableCell>
                <TableCell align="right">Color pictograms</TableCell>
                <TableCell align="right">Black and white pictograms</TableCell>
                <TableCell align="right">Variations (hair, skin)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell align="right">{row.totalPictograms}</TableCell>
                  <TableCell align="right">{row.colorPictograms}</TableCell>
                  <TableCell align="right">{row.noColorPictograms}</TableCell>
                  <TableCell align="right">{row.variations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

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

Catalog.defaultProps = {
  catalogStatus: {},
}
export default withStyles(styles)(Catalog)

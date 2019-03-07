import * as React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { RowDetailState, DataTypeProvider } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, TableRowDetail } from '@devexpress/dx-react-grid-material-ui'
import openSocket from 'socket.io-client'
import api from 'services'
import View from 'components/View'
import LinearProgress from '@material-ui/core/LinearProgress'
import BuildIcon from '@material-ui/icons/Build'
import PublishedIcon from '@material-ui/icons/Done'
import BuildingIcon from 'components/BuildingIcon'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { FormattedMessage, injectIntl, intlShape, FormattedTime, FormattedDate } from 'react-intl'
import styles from './styles'
import messages from './messages'

const isValidDate = d => d instanceof Date && !isNaN(d)

const DateFormatter = ({ value }) => {
  if (value === 'Now') return <BuildingIcon />
  const date = new Date(value)
  if (!isValidDate(date))
    return (
      <span>
        <FormattedMessage {...messages.never} />
      </span>
    )
  return (
    <span>
      {' '}
      <FormattedDate value={date} /> <FormattedTime value={date} />{' '}
    </span>
  )
}
const NumericFormatter = ({ value }) => <p style={{ textAlign: 'center' }}>{value}</p>
const DoneFormatter = ({ value }) => (value ? <PublishedIcon /> : '')

const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />
const NumericTypeProvider = props => <DataTypeProvider formatterComponent={NumericFormatter} {...props} />
const DoneTypeProvider = props => <DataTypeProvider formatterComponent={DoneFormatter} {...props} />

class CatalogsView extends React.PureComponent {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl

    this.state = {
      columns: [
        { name: 'language', title: formatMessage(messages.language) },
        { name: 'status', title: formatMessage(messages.published) },
        { name: 'lastUpdated', title: formatMessage(messages.lastBuilt) },
        { name: 'size', title: formatMessage(messages.size) },
        { name: 'totalPictograms', title: formatMessage(messages.totalPictograms) },
        { name: 'colorPictograms', title: formatMessage(messages.colorPictograms) },
        { name: 'noColorPictograms', title: formatMessage(messages.noColorPictograms) },
        { name: 'variations', title: formatMessage(messages.variations) },
      ],
      rows: [],
      dateColumns: ['lastUpdated'],
      numberColumns: ['totalPictograms', 'colorPictograms', 'noColorPictograms', 'variations'],
      doneColumns: ['status'],
    }
  }

  RowDetail = ({ row }) => {
    const { classes } = this.props
    const { step, info, complete, error } = row
    const downloadStatus = complete ? (
      <div>
        <h4>Build progress</h4>
        <p>{this.stepInfo(step, info, complete)}</p>
        <LinearProgress variant="determinate" value={complete} />
        {complete === 100 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.generateCatalog(row)}
            className={classes.button}
          >
            {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
            <BuildIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
            Build again
          </Button>
        )}
      </div>
    ) : (
      <div>
        <h4>Build catalog and see its progress status</h4>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.generateCatalog(row)}
          className={classes.button}
        >
          {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
          <BuildIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Build
        </Button>
      </div>
    )
    return <div>{downloadStatus}</div>
  }

  stepInfo = (step, info, complete) => {
    const { formatMessage } = this.props.intl

    let extraInfo
    switch (step) {
      case 1:
        return formatMessage(messages.gettingData)
      case 2:
        extraInfo = info ? `(${info} ${formatMessage(messages.files)})` : `(0 ${formatMessage(messages.files)})`
        return formatMessage(messages.gettingPictos, { extraInfo })
      case 3:
        extraInfo = info ? `(${info})` : `(${formatMessage(messages.calculatingSize)})`
        return formatMessage(messages.compressingFiles, { extraInfo })
      case 4:
        return info ? formatMessage(messages.updatingCatalog, { info }) : formatMessage(messages.connectingServer)
      case 5:
        return complete === 100
          ? formatMessage(messages.createdCatalog, { info })
          : formatMessage(messages.updatingData)
      default:
        return ''
    }
  }

  generateCatalog = async row => {
    const { language } = row
    try {
      await api.GENERATE_CATALOG({ language })
    } catch (err) {
      console.log(err)
    }
  }

  generateCatalogs = async () => {
    try {
      await api.GENERATE_CATALOGS()
    } catch (err) {
      console.log(err)
    }
  }

  async componentDidMount() {
    const rows = await api.CATALOGS_REQUEST()
    this.setState({ rows })

    // get current status: generating, crompressing and so on
    const socket = openSocket('https://privateapi.arasaac.org')
    socket.on('catalogStatus', catalogStatus => {
      console.log(JSON.stringify(catalogStatus))
      this.setState(prevState => {
        let rows = [...prevState.rows]
        Object.keys(catalogStatus).forEach(language => {
          rows = rows.filter(row => {
            if (row.language === language) {
              row.step = catalogStatus[language].step
              row.complete = catalogStatus[language].complete
              if (row.complete >= 0 && row.complete < 100) {
                row.lastUpdated = 'Now'
              }
              if (row.complete === 100) {
                const {
                  amountTime,
                  colorPictograms,
                  noColorPictograms,
                  variations,
                  size,
                  totalPictograms,
                  lastUpdated,
                } = catalogStatus[language].info
                row.info = amountTime
                row.lastUpdated = lastUpdated
                row.size = size
                row.status = 1
                row.totalPictograms = totalPictograms
                row.colorPictograms = colorPictograms
                row.noColorPictograms = noColorPictograms
                row.variations = variations
              } else {
                row.info = catalogStatus[language].info
              }
              row.err = catalogStatus[language].err
            }
            return row
          })
        })
        return { rows }
      })
    })
  }

  render() {
    const { columns, rows, dateColumns, numberColumns, doneColumns } = this.state
    const { classes } = this.props
    return (
      <div>
        <View>
          <h1>
            <FormattedMessage {...messages.catalogsManagement} />
          </h1>
          <Button variant="contained" color="primary" onClick={this.generateCatalogs} className={classes.button}>
            {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
            <BuildIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
            Build all catalogs
          </Button>
        </View>

        <Paper>
          <Grid rows={rows} columns={columns}>
            <DateTypeProvider for={dateColumns} />
            <NumericTypeProvider for={numberColumns} />
            <DoneTypeProvider for={doneColumns} />
            <RowDetailState />
            <Table />
            <TableHeaderRow />
            <TableRowDetail contentComponent={this.RowDetail} />
          </Grid>
        </Paper>
      </div>
    )
  }
}

CatalogsView.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(injectIntl(CatalogsView))

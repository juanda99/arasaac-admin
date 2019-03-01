import * as React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { RowDetailState } from '@devexpress/dx-react-grid'
import openSocket from 'socket.io-client'
import api from 'services'
import View from 'components/View'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Grid, Table, TableHeaderRow, TableRowDetail } from '@devexpress/dx-react-grid-material-ui'
import { withStyles } from '@material-ui/core/styles'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import styles from './styles'
import messages from './messages'

const detailContainerStyles = theme => ({
  detailContainer: {
    marginBottom: 3 * theme.spacing.unit,
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
  },
  paper: {
    paddingTop: 3.5 * theme.spacing.unit,
  },
})

const stepInfo = (step, info, complete) => {
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

const gridDetailContainerBase = data => ({ row, classes }) => {
  const { step, info, complete, error } = row
  const downloadStatus = complete ? (
    <div>
      <p>{stepInfo(step, info, complete)}</p>
      <LinearProgress variant="determinate" value={complete} />
    </div>
  ) : (
    <p>Waiting....</p>
  )

  return (
    <div className={classes.detailContainer}>
      <h5 className={classes.title}>Build progress</h5>
      <Paper className={classes.paper}>
        <p>{downloadStatus}</p>
      </Paper>
    </div>
  )
}
const gridDetailContainer = data =>
  withStyles(detailContainerStyles, { name: 'ChartContainer' })(gridDetailContainerBase(data))

class CatalogsView extends React.PureComponent {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl

    this.state = {
      columns: [
        { name: 'language', title: formatMessage(messages.language) },
        { name: 'status', title: formatMessage(messages.published) },
        { name: 'lastBuilt', title: formatMessage(messages.lastBuilt) },
        { name: 'size', title: formatMessage(messages.size) },
        { name: 'totalPictograms', title: formatMessage(messages.totalPictograms) },
        { name: 'colorPictograms', title: formatMessage(messages.colorPictograms) },
        { name: 'noColorPictograms', title: formatMessage(messages.noColorPictograms) },
        { name: 'variations', title: formatMessage(messages.variations) },
      ],
      rows: [],
    }
  }

  async componentDidMount() {
    const rows = await api.CATALOGS_REQUEST()
    this.setState({ rows })

    // get current status: generating, crompressing and so on
    const socket = openSocket('https://privateapi.arasaac.org')
    socket.on('catalogStatus', catalogStatus => {
      // const { step, complete, error, info } = data.es
      // console.log(data.es.complete)

      this.setState(prevState => {
        let rows = [...prevState.rows]
        Object.keys(catalogStatus).forEach(language => {
          rows = rows.filter(row => {
            if (row.language === language) {
              row.step = catalogStatus[language].step
              row.info = catalogStatus[language].info
              row.complete = catalogStatus[language].complete
              row.err = catalogStatus[language].err
            }
            return row
          })
        })
        this.setState({ rows })
      })
    })
  }

  render() {
    const { columns, rows, data } = this.state
    return (
      <div>
        <View>
          <h1>
            <FormattedMessage {...messages.catalogsManagement} />
          </h1>
        </View>
        <Paper>
          <Grid rows={rows} columns={columns}>
            <RowDetailState defaultExpandedRowIds={[1]} />
            <Table />
            <TableHeaderRow />
            <TableRowDetail contentComponent={gridDetailContainer(data)} />
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

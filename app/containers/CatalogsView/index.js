import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import openSocket from 'socket.io-client'
import api from 'services'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import Catalog from 'components/Catalog'

import reducer from './reducer'

import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class CatalogsView extends React.PureComponent {
  state = {
    catalogStatus: {},
    catalogs: [],
  }

  stepInfo = step => {
    switch (step) {
      case 1:
        return 'Getting pictogram data from database'
      case 2:
        return 'Getting pictogram files'
      case 3:
        return 'Compressing pictogram files'
      case 4:
        return 'Publishing zip file'
      case 5:
        return 'Updating catalog data in database'
      default:
        return ''
    }
  }

  showInfo = (step, info) => {
    switch (step) {
      case 2:
        return info ? `(${info} files)` : '(0 files)'
      case 3:
        return info ? `(${info})` : '(Calculating size...)'
      case 4:
        return info ? `(${info})` : '(Connecting to public server...)'
      default:
        return ''
    }
  }

  async componentDidMount() {
    const catalogs = await api.CATALOGS_REQUEST()
    this.setState({ catalogs })

    // get current status: generating, crompressing and so on
    const socket = openSocket('https://privateapi.arasaac.org')
    socket.on('catalogStatus', catalogStatus => {
      // const { step, complete, error, info } = data.es
      // console.log(data.es.complete)
      this.setState({ catalogStatus })
    })
  }

  render() {
    const { classes } = this.props
    const { catalogStatus, catalogs } = this.state
    const catalogItems = catalogs
      .sort(
        (catalogA, catalogB) =>
          // eslint-disable-next-line no-nested-ternary
          catalogA.language < catalogB.language ? -1 : catalogA.language > catalogB.language ? 1 : 0,
      )
      .map(catalog => <Catalog catalog={catalog} catalogStatus={catalogStatus[catalog.language]} />)

    // const { step, complete, error, info } = this.state
    // console.log(`step ${step} complete: ${complete} error: ${error}`)
    console.log('-------------')
    console.log(catalogs)
    console.log(catalogItems)

    //       < p >
    //       { this.stepInfo(step) } { this.showInfo(step, info)
    //   }
    //           </p>
    //   <p>{error}</p>
    // { !!complete && <LinearProgress variant="determinate" value={complete} /> }
    //         </div >

    return (
      <View>
        <div className={classes.root}>
          <p>Generación de catálogos</p>
          {catalogItems}
        </div>
      </View>
    )
  }
}

CatalogsView.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(CatalogsView)

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import openSocket from 'socket.io-client'
import api from 'services'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import Catalog from 'components/Catalog'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class CatalogsView extends React.PureComponent {
  state = {
    catalogStatus: {},
    catalogs: [],
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

    return (
      <View>
        <div className={classes.root}>
          <p>
            <FormattedMessage {...messages.catalogGeneration} />
          </p>
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

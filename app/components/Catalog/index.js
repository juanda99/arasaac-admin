import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@material-ui/core/LinearProgress'

export class Catalog extends PureComponent {
  render() {
    const { catalog, catalogStatus } = this.props
    console.log(catalog)
    console.log(catalogStatus)

    // const { step, complete, error, info } = this.state
    // console.log(`step ${step} complete: ${complete} error: ${error}`)
    // console.log(catalogStatus)
    // console.log(catalogStatus.es)

    //       < p >
    //       { this.stepInfo(step) } { this.showInfo(step, info)
    //   }
    //           </p>
    //   <p>{error}</p>
    // { !!complete && <LinearProgress variant="determinate" value={complete} /> }
    //         </div >

    return (
      <div>
        <h2>Catalogs for language {catalog.language}</h2>
        <h3>Black and white catalog</h3>

        <h3>ColorCatalog</h3>
      </div>
    )
  }
}

Catalog.propTypes = {
  catalog: PropTypes.object,
  catalogStatus: PropTypes.object,
}

export default Catalog

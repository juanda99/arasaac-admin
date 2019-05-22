import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PICTOGRAMS_URL } from 'services/config'
import ConditionalPaper from './ConditionalPaper'

class Pictogram extends Component {
  static propTypes = {
    pictogram: PropTypes.object.isRequired,
  }

  render() {
    const { pictogram } = this.props
    console.log(`Pictogram: ${JSON.stringify(pictogram)}`)
    const { tags, keywords, syncsets, idPictogram, status } = pictogram

    return (
      <ConditionalPaper>
        <img src={`${PICTOGRAMS_URL}/${idPictogram}/${idPictogram}_500.png`} />
      </ConditionalPaper>
    )
  }
}

export default Pictogram

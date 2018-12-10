import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import PictogramSnippet from '../PictogramSnippet'
const Masonry = require('react-masonry-component')
const masonryOptions = {
  transitionDuration: '1s',
}

const styles = {
  masonry: {
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
}

export class PictogramList extends PureComponent {
  render() {
    const { locale, pictograms, searchText } = this.props
    const renderPictograms = pictograms.map(pictogram => (
      <PictogramSnippet pictogram={pictogram} searchText={searchText} locale={locale} key={pictogram.idPictogram} />
    ))

    return (
      <div>
        <Masonry
          className="my-gallery-class" // default ''
          elementType="ul" // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          onClick={this.handleClick}
          style={styles.masonry}
        >
          {renderPictograms}
        </Masonry>
      </div>
    )
  }
}

PictogramList.propTypes = {
  pictograms: PropTypes.arrayOf(PropTypes.object).isRequired,
  locale: PropTypes.string,
  searchText: PropTypes.string,
}

export default PictogramList

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Pagination from 'material-ui-flat-pagination'
import PictogramSnippet from '../PictogramSnippet'
const Masonry = require('react-masonry-component')
const masonryOptions = {
  transitionDuration: 0,
}
const itemsPerPage = 30

const styles = {
  masonry: {
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  pagination: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export class PictogramList extends PureComponent {
  handleClick = offset => this.props.onPageClick(offset)

  render() {
    const { pictograms, searchText, offset } = this.props
    const pictos = pictograms.map(pictogram => pictogram._id)
    const numberItems = pictograms.length
    const visiblePictograms = pictograms.slice(offset, offset + itemsPerPage)
    const pagination =
      numberItems >= itemsPerPage ? (
        <div style={styles.pagination}>
          <Pagination
            limit={itemsPerPage}
            offset={offset}
            size="large"
            total={numberItems}
            onClick={(e, offsetParam) => this.handleClick(offsetParam)}
            currentPageColor="inherit"
          />
        </div>
      ) : null

    const renderPictograms = visiblePictograms.map(pictogram => (
      <PictogramSnippet pictogram={pictogram} pictograms={pictos} searchText={searchText} key={pictogram._id} />
    ))

    return (
      <div>
        {pagination}
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
        {pagination}
      </div>
    )
  }
}

PictogramList.propTypes = {
  pictograms: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchText: PropTypes.string,
  offset: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
}

export default PictogramList

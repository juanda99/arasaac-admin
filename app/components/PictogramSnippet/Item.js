/**
 *
 * Item: we used it also inside buttons from components/pictogram to navigate inside lists
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Item extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    url: PropTypes.string.isRequired,
    pictograms: PropTypes.array.isRequired,
    children: PropTypes.node,
  }

  render() {
    const { children, pictograms } = this.props
    return (
      <Link
        to={{
          pathname: this.props.url,
          state: { pictograms },
        }}
      >
        {children}
      </Link>
    )
  }
}

export default Item

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Tree extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const { data } = this.props
    console.log(data)
    return (
      <div>
        {data.title}
        kkk
      </div>
    )
  }
}

export default Tree

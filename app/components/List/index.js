import React, { Component } from 'react'
import PropTypes from 'prop-types'

// From: https://codepen.io/mochiron/pen/jrymLG

class Item extends Component {
  render() {
    return (
      <li>
        {this.props.name}
        {this.props.children}
      </li>
    )
  }
}

class List extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  constructor() {
    super()
  }

  list(data) {
    const children = items => {
      if (items) {
        return <ul>{this.list(items)}</ul>
      }
    }

    return data.map((node, index) => (
      <Item key={node.id} name={node.name}>
        {children(node.items)}
      </Item>
    ))
  }

  render() {
    return <ul>{this.list(this.props.data)}</ul>
  }
}

export default List

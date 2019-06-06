import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree as TreeC } from 'antd'
import 'antd/dist/antd.css'

const { TreeNode } = TreeC

export class Tree extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        children: PropTypes.array,
      }),
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  state = {
    expandedKeys: [],
    autoExpandParent: true,
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  handleSelect = (selectedKeys, info) => {
    console.log('onSelect', info)
    this.props.onSelect({ selectedKeys })
  }

  renderTreeNodes = data =>
    Object.keys(data).map(item => {
      if (data[item].children) {
        return (
          <TreeNode title={data[item].tag} key={item} dataRef={item}>
            {this.renderTreeNodes(data[item].children)}
          </TreeNode>
        )
      }
      return <TreeNode title={data[item].tag} key={item} dataRef={item} />
    })

  render() {
    const { data, selectedKeys } = this.props
    return (
      <TreeC
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onSelect={this.handleSelect}
        selectedKeys={selectedKeys}
      >
        {this.renderTreeNodes(data)}
      </TreeC>
    )
  }
}

export default Tree

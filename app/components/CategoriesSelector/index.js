/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
import 'antd/dist/antd.css'
// import treeData from './treeData.js'

const categoriesToArray = obj =>
  Object.keys(obj).map(k => {
    obj[k].key = k
    obj[k].label = obj[k].tag
    obj[k].value = k
    obj[k].disabled = (obj[k].keywords.length===0)
    if (obj[k].children) obj[k].children = categoriesToArray(obj[k].children)
    return obj[k]
  })

class CategoriesSelector extends PureComponent {
  componentDidMount() {
    let cloneCategories = JSON.parse(JSON.stringify(this.props.categories)) 
    this.setState({ treeData: categoriesToArray(cloneCategories) })
  }

  state = {
    value: undefined,
    treeData: [],
  }

  onChange = value => {
    this.setState({ value })
  }

  render() {
    const { treeData, value } = this.state
    console.log(treeData)
    return (
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder="Please select"
        onChange={this.onChange}
        multiple
      />
    )
  }
}

CategoriesSelector.propTypes = {
  categories: PropTypes.object.isRequired,
}

export default CategoriesSelector

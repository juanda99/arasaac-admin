/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
import 'antd/dist/antd.css'
// import treeData from './treeData.js'

const categoriesToArray = obj =>
  Object.keys(obj).map(k => {
    obj[k].key = k
    obj[k].title = obj[k].text
    obj[k].value = k
    obj[k].disabled = !obj[k].keywords || obj[k].keywords.length === 0
    if (obj[k].children) obj[k].children = categoriesToArray(obj[k].children)
    return obj[k]
  })

class CategoriesSelector extends PureComponent {
  componentDidMount() {
    const cloneCategories = JSON.parse(JSON.stringify(this.props.categories))
    this.setState({ treeData: categoriesToArray(cloneCategories) })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories !== this.props.categories) {
      const cloneCategories = JSON.parse(JSON.stringify(nextProps.categories))
      this.setState({ treeData: categoriesToArray(cloneCategories) })
    }
  }

  state = {
    treeData: [],
  }

  onSelect = (value, node, extra) => {
    // console.log(value, node, extra)
  }

  onChange = (key, tag) => {
    const { value, onChange } = this.props.input
    onChange(key)
    // this.setState({ value: key })
  }

  render() {
    const { treeData } = this.state
    const { value } = this.props.input
    return (
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder="Please select"
        onChange={this.onChange}
        onSelect={this.onSelect}
        multiple
      />
    )
  }
}

CategoriesSelector.propTypes = {
  categories: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
}

export default CategoriesSelector

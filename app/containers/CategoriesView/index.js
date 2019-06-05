/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import Tree from 'components/Tree'
import Grid from '@material-ui/core/Grid'
import CategoryEditor from 'components/CategoryEditor'
import jp from 'jsonpath'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

const treeData = {
  panaderia: {
    title: 'Panadería',
    key: 'panaderia',
    children: {
      pan: {
        title: 'Tipos de pan',
        key: 'pan',
        children: {
          hogaza: { title: 'Hogaza', key: 'hogaza' },
          baguette: { title: 'Baguette', key: 'baguette' },
        },
      },
      leche: { title: 'Leche', key: 'leche' },
      magdalenas: { title: 'Magdalenas', key: 'magdalenas' },
    },
  },
}

export default class CategoriesView extends React.PureComponent {
  state = {
    // selected Category (just one)
    selectedKeys: [],
  }

  handleSelect = data => {
    const { selectedKeys } = data
    this.setState({ selectedKeys })
  }

  render() {
    const { selectedKeys } = this.state
    const category = selectedKeys[0] || ''
    const data = category ? jp.value(treeData, `$..${category}`) : {}
    // const slicedTreeData = treeData._root
    // const categoryPath = ''
    // if (category) {
    //   const paths = jp.paths(treeData, `$..*[?(@.key=="${category}")]`)
    //   categoryPath = paths[0].reduce((path, itemPath) => {
    //     if (itemPath === '$' || itemPath === '_root') {
    //       return ''
    //     }
    //     const partialPath = itemPath === 'children' ? path : `${path} / ${slicedTreeData[itemPath].title}`
    //     slicedTreeData = slicedTreeData[itemPath]
    //     return partialPath
    //   })
    // }
    return (
      <Grid container>
        <Grid item xs={12}>
          <h1>
            <FormattedMessage {...messages.header} />
          </h1>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tree data={treeData} onSelect={this.handleSelect} selectedKeys={selectedKeys} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {selectedKeys && <CategoryEditor data={data} />}
        </Grid>
      </Grid>
    )
  }
}

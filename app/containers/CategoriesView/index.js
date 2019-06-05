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
  // need root so jsonpath works ok for first depth keys
  _root: [
    {
      title: 'Alimentación',
      key: 'alimentacion',
      children: [
        {
          title: 'Pollería',
          key: 'polleria',
          children: [
            { title: 'Pechugas', key: 'pechugas' },
            { title: 'Alitas de pollo', key: 'alitas' },
            { title: 'Pollo al ast', key: 'pollo' },
          ],
        },
        {
          title: 'Verdulería',
          key: 'verduleria',
          children: [
            { title: 'Borraja', key: 'borraja' },
            { title: 'Lechuga', key: 'lechuga' },
            {
              title: 'Tomates',
              key: 'tomate',
              children: [
                { title: 'tomate de barbastro', key: 'tombarbastro' },
                { title: 'Tomate negro', key: 'tomatenegro' },
              ],
            },
          ],
        },
        {
          title: 'Supermercado',
          key: 'supermercado',
        },
      ],
    },
    {
      title: 'Panadería',
      key: 'panaderia',
      children: [
        { title: 'Pan', key: 'pan' },
        { title: 'Magdalenas', key: 'madalenas' },
        { title: 'Leche', key: 'leche' },
      ],
    },
    {
      title: 'Papelería',
      key: 'papelería',
    },
  ],
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
    let slicedTreeData = treeData._root
    let categoryPath = ''
    if (category) {
      const paths = jp.paths(treeData, `$..*[?(@.key=="${category}")]`)
      categoryPath = paths[0].reduce((path, itemPath) => {
        if (itemPath === '$' || itemPath === '_root') {
          return ''
        }
        const partialPath = itemPath === 'children' ? path : `${path} / ${slicedTreeData[itemPath].title}`
        slicedTreeData = slicedTreeData[itemPath]
        return partialPath
      })
    }
    console.log('*******************************')
    console.log(categoryPath)
    console.log(slicedTreeData)
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>
            <FormattedMessage {...messages.header} />
          </h1>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tree data={treeData._root} onSelect={this.handleSelect} selectedKeys={selectedKeys} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {selectedKeys && <CategoryEditor data={slicedTreeData} />}
        </Grid>
      </Grid>
    )
  }
}

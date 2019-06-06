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
import List from 'components/List'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

const categories = {
  panaderia: {
    tag: 'Panadería',
    children: {
      pan: {
        tag: 'Tipos de pan',
        keywords: ['Tipos de pan', 'Barras de pan'],
        children: {
          hogaza: { tag: 'Hogaza', keywords: ['Pan de hogaza', 'Pan de pueblo'] },
          baguette: { tag: 'Baguette', keywords: ['Pan de baguette', 'Baguette'] },
        },
      },
      leche: { tag: 'Leche', keywords: ['Leche'] },
      magdalenas: { tag: 'Magdalenas', keywords: ['Magdalenas', 'Madalenas'] },
    },
  },
}

export default class CategoriesView extends React.PureComponent {
  state = {
    category: '',
  }

  handleSelect = data => {
    const category = data.selectedKeys[0]
    this.setState({ category })
  }

  render() {
    const { category } = this.state

    const data = category ? jp.value(categories, `$..${category}`) : {}
    console.log(JSON.stringify(data, null, 2))
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
        <Grid item xs={12} sm={3}>
          <Tree data={categories} onSelect={this.handleSelect} selectedKeys={category} />
        </Grid>
        <Grid item xs={12} sm={8}>
          {category && <CategoryEditor data={data} />}
        </Grid>

        <Grid item xs={12}>
          <List data={categories} />,
        </Grid>
      </Grid>
    )
  }
}

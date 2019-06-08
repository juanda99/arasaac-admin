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
import jp from 'jsonpath'
import List from 'components/List'
import { removeKeys } from 'utils'
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

  handleSelect = category => {
    // const category = data.selectedKeys[0]
    this.setState({ category })
  }

  handleDelete = item => removeKeys(categories, item)
  // TODO: remove also from relationsships!!!

  handleAdd = (item, value) => {
    console.log(`*****${item}`)
    const path = jp.paths(categories, `$..${item}`)[0]
    path.shift()
    console.log(path)
    let aux = categories
    path.forEach(key => {
      aux = aux[key]
    })
    aux.prueba = { tag: 'XXXXX' }
  }

  removeKey = (obj, item) => {
    if (obj[item]) {
      delete obj[item]
      return true
    }
    return Object.keys(obj).some(key => this.removeKey(obj[key], item))
  }

  render() {
    const { category } = this.state
    // const data = category ? jp.value(categories, `$..${category}`) : {}
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <List
          data={categories}
          onSelect={this.handleSelect}
          category={category}
          onDelete={this.handleDelete}
          onAdd={this.handleAdd}
        />
      </div>
    )
  }
}

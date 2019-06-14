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
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import List from 'components/List'
import injectReducer from 'utils/injectReducer'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import styles from './styles'
import { categories, categoriesUpdate, categoriesAdd, categoriesDelete } from './actions'
import { makeLoadingSelector, makeCategoriesSelectorByLocale, makeLastUpdatedSelectorByLocale } from './selectors'
import reducer from './reducer'
import messages from './messages'
import saga from './sagas'

/* eslint-disable react/prefer-stateless-function */

// inserted in database:
/*
{ locale: 'es',
  lastUpdated: ISODate("2019-09-09T01:11:18.965Z"),
  data: {
      panaderia: {
        tag: 'Panadería',
        children: {
          pan: {
            tag: 'Tipos de pan',
            keywords: ['Tipos de pan', 'Barras de pan'],
            children: {
              hogaza: { tag: 'Hogaza', keywords: ['Pan de hogaza', 'Pan de pueblo'] },
              baguette: { tag: 'Baguette', keywords: ['Pan de baguette', 'Baguette'] }
            }
          },
          leche: { tag: 'Leche', keywords: ['Leche'] },
          magdalenas: { tag: 'Magdalenas', keywords: ['Magdalenas', 'Madalenas'] }
        }
      }
  }
}
*/

// const categories = {
//   panaderia: {
//     tag: 'Panadería',
//     children: {
//       pan: {
//         tag: 'Tipos de pan',
//         keywords: ['Tipos de pan', 'Barras de pan'],
//         children: {
//           hogaza: { tag: 'Hogaza', keywords: ['Pan de hogaza', 'Pan de pueblo'] },
//           baguette: { tag: 'Baguette', keywords: ['Pan de baguette', 'Baguette'] },
//         },
//       },
//       leche: { tag: 'Leche', keywords: ['Leche'] },
//       magdalenas: { tag: 'Magdalenas', keywords: ['Magdalenas', 'Madalenas'] },
//     },
//   },
// }

class CategoriesView extends React.PureComponent {
  state = {
    category: '',
  }

  componentDidMount() {
    const { locale, lastUpdated } = this.props
    console.log(`LastUpdatedddddd: ${lastUpdated}`)
    this.props.requestCategories(locale, lastUpdated)
  }

  handleSelect = category => {
    // const category = data.selectedKeys[0]
    this.setState({ category })
  }

  // handleDelete = item => removeKeys(categories, item)
  // TODO: remove also from relationsships!!!

  handleAdd = (parentItem, data) => {
    const { locale, lastUpdated, requestCategoriesAdd } = this.props
    requestCategoriesAdd(locale, lastUpdated, parentItem, data)
  }

  handleUpdate = (item, data) => {
    const { locale, lastUpdated, requestCategoriesUpdate } = this.props
    requestCategoriesUpdate(locale, lastUpdated, item, data)
  }

  handleDelete = item => {
    const { locale, lastUpdated, requestCategoriesDelete } = this.props
    requestCategoriesDelete(locale, lastUpdated, item)
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

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state),
  lastUpdated: makeLastUpdatedSelectorByLocale()(state),
  categories: makeCategoriesSelectorByLocale()(state),
})

const mapDispatchToProps = dispatch => ({
  requestCategories: (locale, lastUpdated) => {
    dispatch(categories.request(locale, lastUpdated))
  },
  requestCategoriesUpdate: (locale, lastUpdated, item, data) => {
    dispatch(categoriesUpdate.request(locale, lastUpdated, item, data))
  },
  requestCategoriesDelete: (locale, lastUpdated, item) => {
    dispatch(categoriesDelete.request(locale, lastUpdated, item))
  },
  requestCategoriesAdd: (locale, lastUpdated, parentItem, data) => {
    dispatch(categoriesAdd.request(locale, lastUpdated, parentItem, data))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'categoriesView', reducer })
const withSaga = injectSaga({ key: 'categoriesView', saga, mode: DAEMON })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(CategoriesView))

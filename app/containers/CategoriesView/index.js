import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
import { withStyles } from '@material-ui/core/styles'
import ListTree from 'components/ListTree'
// import injectReducer from 'utils/injectReducer'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import SearchField from 'components/SearchField'
import jp from 'jsonpath'
// import DragDropFile from './DragDropFile'
import styles from './styles'
import { categories, categoriesUpdate, categoriesAdd, categoriesDelete } from './actions'
import { makeLoadingSelector, makeCategoriesSelectorByLocale, makeLastUpdatedSelectorByLocale } from './selectors'
// import reducer from './reducer'
import messages from './messages'
import saga from './sagas'

/* eslint-disable react/prefer-stateless-function */

class CategoriesView extends React.PureComponent {
  state = {
    category: '',
    searchText: '',
    open: {}, // category trees that are opened
    openForm: '', // category form open, just once at a time
  }

  componentDidMount() {
    const { locale, lastUpdated } = this.props
    this.props.requestCategories(locale, lastUpdated)
  }

  handleClick = category => {
    const { open } = this.state
    open[category] = !open[category]
    // we close the form when opening a category
    this.setState({ open, openForm: '', category })
  }

  handleSubmit = category => {
    console.log('Handle Submit!!!s')
    // we get all subcategories with keyword as category(searchText) submitted.
    // open all items categories in path
    const { data } = this.props.categories
    const paths = jp.paths(data, `$..keywords[?(@==(["${category}"]))]`)
    const open = {}
    let openForm
    paths.forEach(path => {
      const filtered = path.filter(item => isNaN(item) && item !== '$' && item !== 'children' && item !== 'keywords')
      if (filtered.length) filtered.forEach(element => (open[element] = true))
      openForm = filtered[filtered.length - 1]
    })
    console.log(open)
    this.setState({ open, openForm })
  }

  handleAdd = (data, parentItem) => {
    const { locale, requestCategoriesAdd } = this.props
    requestCategoriesAdd('shouldBeToken', locale, parentItem, data)
  }

  handleUpdate = (data, item) => {
    const { locale, requestCategoriesUpdate } = this.props
    requestCategoriesUpdate('shouldBeToken', locale, item, data)
  }

  handleDelete = item => {
    const { locale, requestCategoriesDelete } = this.props
    requestCategoriesDelete('shouldBeToken', locale, item)
  }

  test = key => {
    console.log(key)
    console.log('ha hecho click')
  }

  render() {
    const { category, searchText, open, openForm } = this.state
    const { data } = this.props.categories || {}
    const tmpKeywords = data ? jp.query(data, '$..keywords') : []
    const keywords = [].concat.apply([], tmpKeywords)
    const uniqueKeywords = [...new Set(keywords)]
    return (
      <View>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <SearchField
          value={searchText}
          // onRequestSearch={this.handleSubmit}
          onSubmit={this.handleSubmit}
          style={styles.searchBar}
          dataSource={uniqueKeywords}
          onChange={this.test}
        />
        {data && (
          <ListTree
            data={data}
            category={category}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onAdd={this.handleAdd}
            onClick={this.handleClick}
            open={open}
            openForm={openForm}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state), // for categories
  lastUpdated: makeLastUpdatedSelectorByLocale()(state),
  categories: makeCategoriesSelectorByLocale()(state),
})

const mapDispatchToProps = dispatch => ({
  requestCategories: (locale, lastUpdated) => {
    dispatch(categories.request(locale, lastUpdated))
  },
  requestCategoriesUpdate: (token, locale, item, data) => {
    dispatch(categoriesUpdate.request(token, locale, item, data))
  },
  requestCategoriesDelete: (token, locale, item) => {
    dispatch(categoriesDelete.request(token, locale, item))
  },
  requestCategoriesAdd: (token, locale, parentItem, data) => {
    dispatch(categoriesAdd.request(token, locale, parentItem, data))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
// const withReducer = injectReducer({ key: 'categoriesView', reducer })
const withSaga = injectSaga({ key: 'categoriesView', saga, mode: DAEMON })

export default compose(
  // withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(CategoriesView))

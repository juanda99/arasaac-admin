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

// get autocomplete keywords for tag selector and search field in cdm
let uniqueKeywords
let uniqueTags

class CategoriesView extends React.Component {
  state = {
    category: '',
    searchText: '',
    open: {}, // category trees that are opened
    openForm: '', // category form open, just once at a time
    action: '',
    targetItem: '', // for delete
    confirmationBoxOpen: false, // use prior to deleting
  }

  async componentDidMount() {
    const { locale, lastUpdated } = this.props
    await this.props.requestCategories(locale, lastUpdated)
    // get keywords:
    const { data } = this.props.categories || {}
    const tmpKeywords = data ? jp.query(data, '$..keywords') : []
    const keywords = [].concat.apply([], tmpKeywords)
    uniqueKeywords = [...new Set(keywords)]
    // get tags
    const tmpTags = data ? jp.query(data, '$..tags') : []
    const tags = [].concat.apply([], tmpTags)
    uniqueTags = [...new Set(tags)]
  }

  handleClick = category => {
    const { open } = this.state
    open[category] = !open[category]
    // we close the form when opening a category
    this.setState({ open, openForm: '', category })
  }

  handleClose = () => this.setState({ openForm: '' })

  // we get treeview open as category(searchText) is submitted.
  // form category is open for edition
  handleSubmit = category => {
    const { data } = this.props.categories
    const paths = jp.paths(data, `$..keywords[?(@==(["${category}"]))]`)
    const open = {}
    let openForm
    paths.forEach(path => {
      const filtered = path.filter(item => isNaN(item) && item !== '$' && item !== 'children' && item !== 'keywords')
      if (filtered.length) filtered.forEach(element => (open[element] = true))
      openForm = filtered[filtered.length - 1]
    })
    this.setState({ open, openForm, action: 'edit' })
  }

  handleBeforeAdd = item => {
    this.setState({ openForm: item, targetItem: item, action: 'add' })
  }

  handleAdd = (data, parentItem) => {
    const { locale, requestCategoriesAdd } = this.props
    this.setState({ openForm: '' })
    requestCategoriesAdd('shouldBeToken', locale, parentItem, data)
  }

  handleEdit = item => this.setState({ openForm: item, targetItem: item, action: 'edit' })

  handleUpdate = (data, item) => {
    const { locale, requestCategoriesUpdate } = this.props
    requestCategoriesUpdate('shouldBeToken', locale, item, data)
  }

  handleBeforeDelete = targetItem => this.setState({ confirmationBoxOpen: true, targetItem, action: 'delete' })

  handleDelete = (item, accept) => {
    this.setState({ confirmationBoxOpen: false })
    const { locale, requestCategoriesDelete } = this.props
    if (accept) requestCategoriesDelete('shouldBeToken', locale, item)
  }

  render() {
    const { category, searchText, open, openForm, targetItem, confirmationBoxOpen, action } = this.state
    const { data } = this.props.categories || {}
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
        />
        {data && (
          <ListTree
            data={data}
            category={category}
            onBeforeDelete={this.handleBeforeDelete}
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            onUpdate={this.handleUpdate}
            onClose={this.handleClose}
            onBeforeAdd={this.handleBeforeAdd}
            onAdd={this.handleAdd}
            onClick={this.handleClick}
            open={open}
            openForm={openForm}
            action={action}
            targetItem={targetItem}
            confirmationBoxOpen={confirmationBoxOpen}
            tags={uniqueTags}
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

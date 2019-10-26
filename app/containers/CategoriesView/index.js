import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import ErrorDialog from 'components/ErrorDialog'
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
import { categories, categoriesUpdate, categoriesAdd, categoriesDelete, removeError } from './actions'
import {
  makeLoadingSelector,
  makeCategoriesSelectorByLocale,
  makeLastUpdatedSelectorByLocale,
  makeTagsSelectorByLocale,
  makeKeywordsSelectorByLocale,
  makeErrorSelector,
} from './selectors'
// import reducer from './reducer'
import messages from './messages'
import saga from './sagas'

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

  handleClose = () => this.setState({ openForm: '' })

  handleErrorDialogClose = () => this.props.requestRemoveError()

  // we get treeview open as category(searchText) is submitted.
  // form category is open for edition
  handleSubmit = category => {
    const { data } = this.props.categories
    const paths = jp.paths(data, `$..keywords[?(@==(["${category}"]))]`)
    const open = {}
    let openForm
    paths.forEach(path => {
      const filtered = path.filter(item => isNaN(item) && item !== '$' && item !== 'children' && item !== 'keywords')
      if (filtered.length)
        filtered.forEach(element => {
          open[element] = true
        })
      openForm = filtered[filtered.length - 1]
    })
    this.setState({ open, openForm, action: 'edit' })
  }

  handleBeforeAdd = item => {
    this.setState({ openForm: item, targetItem: item, action: 'add' })
  }

  handleRemoveSearchText = () => {
    this.setState({
      category: '',
      searchText: '',
      open: {},
      openForm: '',
      action: '',
      targetItem: '',
      confirmationBoxOpen: false,
    })
  }

  handleAdd = (data, parentItem) => {
    const { locale, requestCategoriesAdd } = this.props
    if (!data.keywords) data.keywords = []
    if (!data.tags) data.tags = []
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
    const { keywords, tags, loading } = this.props
    const { data } = this.props.categories || {}
    return (
      <View>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        {!!this.props.error && (
          <ErrorDialog
            title={<FormattedMessage {...messages.errorTitle} />}
            message={this.props.error}
            onClose={this.handleErrorDialogClose}
          />
        )}
        <SearchField
          value={searchText}
          // onRequestSearch={this.handleSubmit}
          onSubmit={this.handleSubmit}
          style={styles.searchBar}
          dataSource={keywords}
          onClear={this.handleRemoveSearchText}
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
            tags={tags}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state), // for categories
  // loading: state.getIn(['categoriesView', 'loading']),
  error: makeErrorSelector()(state),
  lastUpdated: makeLastUpdatedSelectorByLocale()(state),
  categories: makeCategoriesSelectorByLocale()(state),
  keywords: makeKeywordsSelectorByLocale()(state),
  tags: makeTagsSelectorByLocale()(state),
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
  requestRemoveError: () => dispatch(removeError()),
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

CategoriesView.propTypes = {
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  lastUpdated: PropTypes.string,
  categories: PropTypes.object,
  keywords: PropTypes.array,
  tags: PropTypes.array,
  classes: PropTypes.object.isRequired,
}

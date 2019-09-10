import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
import { withStyles } from '@material-ui/core/styles'
import ListTree from 'components/ListTree'
import injectReducer from 'utils/injectReducer'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
// import DragDropFile from './DragDropFile'
import styles from './styles'
import { categories, categoriesUpdate, categoriesAdd, categoriesDelete, categoriesImport } from './actions'
import { makeLoadingSelector, makeCategoriesSelectorByLocale, makeLastUpdatedSelectorByLocale } from './selectors'
import reducer from './reducer'
import messages from './messages'
import saga from './sagas'

/* eslint-disable react/prefer-stateless-function */

class CategoriesView extends React.PureComponent {
  state = {
    category: '',
  }

  componentDidMount() {
    const { locale, lastUpdated } = this.props
    this.props.requestCategories(locale, lastUpdated)
  }

  handleSelect = category => {
    // const category = data.selectedKeys[0]
    this.setState({ category })
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

  render() {
    const { category } = this.state
    const { data } = this.props.categories
    return (
      <View>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        {data && (
          <ListTree
            data={data}
            onSelect={this.handleSelect}
            category={category}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onAdd={this.handleAdd}
          />
        )}
      </View>
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
  requestCategoriesUpdate: (token, locale, item, data) => {
    dispatch(categoriesUpdate.request(token, locale, item, data))
  },
  requestCategoriesDelete: (token, locale, item) => {
    dispatch(categoriesDelete.request(token, locale, item))
  },
  requestCategoriesAdd: (token, locale, parentItem, data) => {
    dispatch(categoriesAdd.request(token, locale, parentItem, data))
  },
  requestCategoriesImport: (token, data) => {
    dispatch(categoriesImport.request(token, data))
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

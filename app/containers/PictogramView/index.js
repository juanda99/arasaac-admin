import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { makeSelectHasUser } from 'containers/UsersView/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import View from 'components/View'
import Pictogram from 'components/Pictogram'
import PictogramForm from 'components/PictogramForm'
import reducer from 'containers/PictogramsView/reducer'
import { categories } from 'containers/CategoriesView/actions'
import { DAEMON } from 'utils/constants'
import {
  makeCategoriesSelectorByLocale,
  makeTagsSelectorByLocale,
  makeLastUpdatedSelectorByLocale,
} from 'containers/CategoriesView/selectors'
import tagLabels from 'components/CategoryForm/tagsMessages'
import saga from './sagas'
import styles from './styles'
import { makeLoadingSelector, makeSelectIdPictogram, makePictogramByIdSelector } from '../PictogramsView/selectors'
import { pictogram } from './actions'

/* eslint-disable react/prefer-stateless-function */

class PictogramView extends React.PureComponent {
  componentDidMount() {
    const { requestPictogram, idPictogram, locale, selectedPictogram, lastUpdatedCategories } = this.props
    /* if pictogram is already in the state we don't request it: */
    if (!selectedPictogram) {
      requestPictogram(idPictogram, locale)
    }
    // we get Categories....
    this.props.requestCategories(locale, lastUpdatedCategories)
    console.log(this.props)
  }

  componentWillReceiveProps(nextProps) {
    // we can change origin/target language, so we should get
    // pictogram data in that language
  }

  componentWillReceiveProps(nextProps) {
    // we should rewrite url
  }

  handleSubmit = values => '' // console.log(values)

  render() {
    const { selectedPictogram, locale, classes, tags, intl } = this.props
    const { formatMessage } = intl
    // console.log(`Selected pictogram: ${selectedPictogram}`)
    const categoriesData = this.props.categories.data || {}
    const suggestions = tags.map(tag => ({ label: formatMessage(tagLabels[tag]), value: tag })).sort(
      (a, b) =>
        a.label
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') >
        b.label
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          ? 1
          : -1,
    )
    return (
      <View>
        {selectedPictogram && (
          <div className={classes.wrapper}>
            <Pictogram pictogram={selectedPictogram} locale={locale} />
            <PictogramForm
              data={selectedPictogram}
              categories={categoriesData}
              locale={locale}
              tags={suggestions}
              onSubmit={this.handleSubmit}
            />
          </div>
        )}
      </View>
    )
  }
}

PictogramView.propTypes = {
  idPictogram: PropTypes.string.isRequired,
  requestPictogram: PropTypes.func.isRequired,
  selectedPictogram: PropTypes.object,
  searchText: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  requestCategories: PropTypes.func.isRequired,
  lastUpdatedCategories: PropTypes.string,
  categories: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  loading: makeLoadingSelector()(state), // for pictos
  selectedPictogram: makePictogramByIdSelector()(state, ownProps),
  locale: makeSelectLocale()(state),
  token: makeSelectHasUser()(state),
  idPictogram: makeSelectIdPictogram()(state, ownProps),
  // for categories
  lastUpdatedCategories: makeLastUpdatedSelectorByLocale()(state),
  categories: makeCategoriesSelectorByLocale()(state),
  tags: makeTagsSelectorByLocale()(state),
})

const mapDispatchToProps = dispatch => ({
  requestPictogram: (locale, searchText) => {
    dispatch(pictogram.request(locale, searchText))
  },
  requestCategories: (locale, lastUpdated) => {
    dispatch(categories.request(locale, lastUpdated))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'pictogramsView', reducer }) // key is the part of the state?
const withSaga = injectSaga({ key: 'pictogramView', saga, DAEMON }) // key is your component

// const withCategoriesReducer = injectReducer({ key: 'categoriesView', categoriesReducer }) // key is the part of the state?
//  const withCategoriesSaga = injectSaga({ key: 'categoriesView', categoriesSaga }) // key is your component

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(injectIntl(PictogramView))))

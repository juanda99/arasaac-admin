import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { compose } from 'redux'
// import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { makeSelectHasUser } from 'containers/UsersView/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import View from 'components/View'
import Pictogram from 'components/Pictogram'
import PictogramForm from 'components/PictogramForm'
// import reducer from 'containers/PictogramsView/reducer'
import saga from 'containers/PictogramsView/sagas'
import { categories } from 'containers/CategoriesView/actions'
import {
  makeCategoriesSelectorByLocale,
  makeTagsSelectorByLocale,
  makeLastUpdatedSelectorByLocale,
} from 'containers/CategoriesView/selectors'
import styles from './styles'
import { makeLoadingSelector, makeSelectIdPictogram, makePictogramByIdSelector } from '../PictogramsView/selectors'
import { pictogram } from './actions'

/* eslint-disable react/prefer-stateless-function */

class PictogramView extends React.PureComponent {
  componentDidMount() {
    const { requestPictogram, idPictogram, locale, selectedPictogram } = this.props
    /* if pictogram is already in the state we don't request it: */
    if (!selectedPictogram) {
      requestPictogram(idPictogram, locale)
    }
  }

  componentWillReceiveProps(nextProps) {
    // we can change origin/target language, so we should get
    // pictogram data in that language
  }

  render() {
    const { selectedPictogram, locale, classes, tags } = this.props
    // console.log(`Selected pictogram: ${selectedPictogram}`)
    const categoriesData = this.props.categories.data || {}
    return (
      <View>
        <div className={classes.wrapper}>
          <Pictogram pictogram={selectedPictogram} locale={locale} />
          <PictogramForm data={selectedPictogram} categories={categoriesData} locale={locale} tags={tags} />
        </div>
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
// const withReducer = injectReducer({ key: 'pictogramsView', reducer }) // key is the part of the state?
const withSaga = injectSaga({ key: 'pictogramView', saga }) // key is y   our component

// const withCategoriesReducer = injectReducer({ key: 'categoriesView', categoriesReducer }) // key is the part of the state?
//  const withCategoriesSaga = injectSaga({ key: 'categoriesView', categoriesSaga }) // key is your component

export default compose(
  // withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(PictogramView)))

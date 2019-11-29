import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ErrorDialog from 'components/ErrorDialog'
import api from 'services'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import View from 'components/View'
import Pictogram from 'components/Pictogram'
import PictogramForm from 'components/PictogramForm'
import reducer from 'containers/PictogramsView/reducer'
import { categories } from 'containers/CategoriesView/actions'
import { makeSelectUserRole, makeSelectHasUser } from 'containers/UsersView/selectors'
import { DAEMON } from 'utils/constants'
import {
  makeCategoriesSelectorByLocale,
  makeTagsSelectorByLocale,
  makeLastUpdatedSelectorByLocale,
} from 'containers/CategoriesView/selectors'
import tagLabels from 'components/CategoryForm/tagsMessages'
import saga from './sagas'
import styles from './styles'
import {
  makeLoadingSelector,
  makeSelectIdPictogram,
  makePictogramByIdSelector,
  makeErrorSelector,
} from '../PictogramsView/selectors'
import { pictogram, pictogramUpdate, removeError } from './actions'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class PictogramView extends React.PureComponent {
  state = {
    keywordsHintLocale: localStorage.getItem('keywordsHintLocale') || null,
    keywords: [],
  }

  getKeywords = keywordsHintLocale => {
    const { idPictogram } = this.props
    api.PICTOGRAM_KEYWORDS_REQUEST({ keywordsHintLocale, idPictogram }).then(data => {
      if (data.keywords && data.keywords.length) {
        this.setState({ keywords: data.keywords, keywordsHintLocale })
      } else if (!data.keywords || data.keywords.length === 0) {
        this.setState({ keywords: [], keywordsHintLocale })
      }
    })
  }

  async componentDidMount() {
    const { requestPictogram, idPictogram, locale, lastUpdatedCategories } = this.props
    const { keywordsHintLocale } = this.state
    /* we always request pictogram, can have changes */
    await requestPictogram(idPictogram, locale)
    // we get Categories....
    this.props.requestCategories(locale, lastUpdatedCategories)
    if (!keywordsHintLocale) {
      if (locale === 'en' || locale === 'val' || locale === 'gl' || locale === 'ca') this.getKeywords('es')
      else this.getKeywords('en')
    }
  }

  handleErrorDialogClose = () => this.props.requestRemoveError()

  handleChangeKeywordsLocale = keywordsHintLocale => this.getKeywords(keywordsHintLocale)

  handleSubmit = pictogram => {
    const { locale, token, requestPictogramUpdate } = this.props
    requestPictogramUpdate(token, locale, pictogram)
  }

  render() {
    const { selectedPictogram, locale, classes, tags, intl, role } = this.props
    const { keywordsHintLocale, keywords } = this.state
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
        {!!this.props.error && (
          <ErrorDialog
            title={<FormattedMessage {...messages.errorTitle} />}
            message={this.props.error}
            onClose={this.handleErrorDialogClose}
          />
        )}
        {selectedPictogram && (
          <div className={classes.wrapper}>
            <Pictogram
              pictogram={selectedPictogram}
              language={keywordsHintLocale}
              keywords={keywords}
              onChangeKeywordsLocale={this.handleChangeKeywordsLocale}
            />
            <PictogramForm
              data={selectedPictogram}
              categories={categoriesData}
              locale={locale}
              tags={suggestions}
              onSubmit={this.handleSubmit}
              role={role}
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
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  locale: PropTypes.string.isRequired,
  requestCategories: PropTypes.func.isRequired,
  lastUpdatedCategories: PropTypes.string,
  requestPictogramUpdate: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  loading: makeLoadingSelector()(state), // for pictos
  error: makeErrorSelector()(state),
  selectedPictogram: makePictogramByIdSelector()(state, ownProps),
  locale: makeSelectLocale()(state),
  token: makeSelectHasUser()(state),
  idPictogram: makeSelectIdPictogram()(state, ownProps),
  // for categories
  lastUpdatedCategories: makeLastUpdatedSelectorByLocale()(state),
  categories: makeCategoriesSelectorByLocale()(state),
  tags: makeTagsSelectorByLocale()(state),
  role: makeSelectUserRole()(state),
})

const mapDispatchToProps = dispatch => ({
  requestPictogram: (idPictogram, locale) => {
    dispatch(pictogram.request(idPictogram, locale))
  },
  requestCategories: (locale, lastUpdated) => {
    dispatch(categories.request(locale, lastUpdated))
  },
  requestPictogramUpdate: (token, locale, pictogram) => {
    dispatch(pictogramUpdate.request(token, locale, pictogram))
  },
  requestRemoveError: () => dispatch(removeError()),
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

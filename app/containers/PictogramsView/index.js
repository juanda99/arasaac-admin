import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import SearchIcon from '@material-ui/icons/Search'
import VisibilityIcon from '@material-ui/icons/VisibilityOff'
import ValidateIcon from '@material-ui/icons/ThumbDown'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import View from 'components/View'
import PictogramsGrid from 'components/PictogramsGrid'
import SearchToggleBar from 'components/SearchToggleBar'
import SearchField from 'components/SearchField'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import injectReducer from 'utils/injectReducer'
import PictogramList from 'components/PictogramList'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import history from 'utils/history'
import reducer from './reducer'
import saga from './sagas'
import {
  makeLoadingSelector,
  makeSearchResultsSelector,
  makeVisiblePictogramsSelector,
  makeKeywordsSelectorByLocale,
  makeLastUpdatedSelector,
  makePictogramsListSelector,
} from './selectors'
import { autocomplete, pictograms, newPictograms } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class PictogramsView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      slideIndex: parseInt(sessionStorage.getItem('pictoSlideIndex'), 10) || 0,
      viewType: sessionStorage.getItem('pictoViewType') || 'module',
      notPublishedOffset: parseInt(sessionStorage.getItem('notPublishedOffset'), 10) || 0,
      notValidOffset: parseInt(sessionStorage.getItem('notValidOffset'), 10) || 0,
      allPictosOffset: parseInt(sessionStorage.getItem('allPictosOffset'), 10) || 0,
    }
  }

  componentDidMount() {
    const { locale, searchText, searchResults, updated } = this.props
    if (searchText && !searchResults) {
      this.props.requestPictograms(locale, searchText)
    }
    this.props.requestNewPictograms(locale, updated)
    this.props.requestAutocomplete(locale)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      const { requestPictograms, locale } = this.props
      requestPictograms(locale, nextProps.searchText)
    }
  }

  handleSubmit = nextValue => history.push(`/pictograms/search/${nextValue}`)

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex })
    sessionStorage.setItem('pictoSlideIndex', slideIndex)
  }

  renderLoading = () => <View>Loading...</View>

  renderError = () => <div>Loading pictograms....</div>

  handleViewType = viewType => {
    this.setState({ viewType })
    sessionStorage.setItem('pictoViewType', viewType)
  }

  handlePageClick = offset => {
    const { slideIndex } = this.state
    let key

    switch (slideIndex) {
      case 0:
        key = 'allPictosOffset'
        break
      case 1:
        key = 'notPublishedOffset'
        break
      case 2:
        key = 'notValidatedOffset'
        break
      default:
        key = ''
        break
    }
    if (key) {
      this.setState({ [key]: offset })
      sessionStorage.setItem(key, offset)
    }
  }

  render() {
    const {
      classes,
      width,
      searchText,
      keywords,
      loading,
      error,
      visiblePictograms,
      pictogramCollection,
      locale,
    } = this.props
    const { notPublishedOffset, notValidOffset, allPictosOffset, slideIndex, viewType } = this.state

    const searchBox = (
      <View>
        <SearchField value={searchText} onSubmit={this.handleSubmit} style={styles.searchBar} dataSource={keywords} />
      </View>
    )
    let renderComponent
    switch (slideIndex) {
      case 0:
        {
          const pictogramList = searchText ? visiblePictograms : pictogramCollection
          renderComponent =
            viewType === 'list' ? (
              <>
                <SearchToggleBar viewType={viewType} changeViewType={this.handleViewType} />
                <PictogramsGrid pictograms={pictogramCollection} locale={locale} searchText={searchText} />
              </>
            ) : (
              <>
                {loading ? (
                  <View>
                    <h3> Getting data....</h3>
                  </View>
                ) : (
                  <>
                    {pictogramList.length ? (
                      <>
                        <SearchToggleBar viewType={viewType} changeViewType={this.handleViewType} />
                        <PictogramList
                          pictograms={pictogramList}
                          locale={locale}
                          searchText={searchText}
                          offset={allPictosOffset}
                          onPageClick={this.handlePageClick}
                        />
                      </>
                    ) : (
                      <View>
                        <h3>{<FormattedMessage {...messages.pictogramsNotFound} />}</h3>
                      </View>
                    )}
                  </>
                )}
              </>
            )
        }
        break
      case 1:
        {
          // TODO: use reselect for memoization
          const unpublishedPictos = pictogramCollection.filter(pictogram => pictogram.published === false)
          renderComponent = (
            <PictogramList
              pictograms={unpublishedPictos}
              locale={locale}
              searchText={searchText}
              offset={notPublishedOffset}
              onPageClick={this.handlePageClick}
            />
          )
        }
        break
      case 2:
        {
          const invalidPictos = pictogramCollection.filter(pictogram => pictogram.validated === false)
          renderComponent = (
            <PictogramList
              pictograms={invalidPictos}
              locale={locale}
              searchText={searchText}
              offset={notValidOffset}
              onPageClick={this.handlePageClick}
            />
          )
        }
        break
      default:
      // not used
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Tabs
            className={classes.tab}
            variant="fullWidth"
            value={slideIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.search} />}
              icon={<SearchIcon />}
              value={0}
              // bug? remove boxShadow here:
              style={{ boxShadow: 'none' }}
            />
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.notPlublished} />}
              icon={<VisibilityIcon />}
              value={1}
            />
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.notValidated} />}
              icon={<ValidateIcon />}
              value={2}
            />
          </Tabs>
          {slideIndex === 0 && searchBox}
          {renderComponent}
        </div>
      </React.Fragment>
    )
  }
}

PictogramsView.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  requestAutocomplete: PropTypes.func.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string),
  pictogramCollection: PropTypes.arrayOf(PropTypes.object),
  requestPictograms: PropTypes.func.isRequired,
  requestNewPictograms: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  visiblePictograms: PropTypes.arrayOf(PropTypes.object),
  locale: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.number),
  updated: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state),
  updated: makeLastUpdatedSelector()(state),
  searchResults: makeSearchResultsSelector()(state, ownProps),
  pictogramCollection: makePictogramsListSelector()(state),
  visiblePictograms: makeVisiblePictogramsSelector()(state, ownProps),
  keywords: makeKeywordsSelectorByLocale()(state),
  searchText: (() => ownProps.match.params.searchText || '')(),
})

const mapDispatchToProps = dispatch => ({
  requestPictograms: (locale, searchText) => {
    dispatch(pictograms.request(locale, searchText))
  },
  requestNewPictograms: (locale, updated) => {
    dispatch(newPictograms.request(locale, updated))
  },
  requestAutocomplete: locale => {
    dispatch(autocomplete.request(locale))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'pictogramsView', reducer })
const withSaga = injectSaga({ key: 'pictogramsView', saga, mode: DAEMON })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(PictogramsView)))

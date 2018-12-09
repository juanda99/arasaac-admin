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
import SearchField from 'components/SearchField'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import injectReducer from 'utils/injectReducer'
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
} from './selectors'
import { autocomplete, pictograms, allPictograms, newPictograms } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class PictogramsView extends React.PureComponent {
  state = {
    slideIndex: 0,
  }

  componentDidMount() {
    const { locale, searchText, searchResults, lastUpdated } = this.props
    if (searchText && !searchResults) {
      this.props.requestPictograms(locale, searchText)
    }
    if (!lastUpdated) this.props.requestAllPictograms(locale)
    else this.props.requestNewPictograms(locale, lastUpdated)
    // this.props.requestNotValidatedPictograms(locale)
    this.props.requestAutocomplete(locale)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      const { requestPictograms, locale } = this.props
      requestPictograms(locale, nextProps.searchText)
    }
  }

  handleSubmit = nextValue => {
    history.push(`/pictograms/search/${nextValue}`)
  }

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex })
  }

  renderLoading = () => <div>Loading...</div>

  renderError = () => <div>I am sorry! Please try again.</div>

  renderNoPictos = () => <div>{<FormattedMessage {...messages.pictogramsNotFound} />}</div>

  render() {
    const { classes, width, searchText, keywords, loading, error, visiblePictograms } = this.props
    const { slideIndex } = this.state
    let pictogramsCounter
    let pictogramsList

    let gallery

    if (loading) gallery = this.renderLoading()
    else if (error) gallery = this.renderError()
    else if (!searchText && slideIndex === 0) gallery = null
    else {
      /* depending on slide we show all pictos, notPublished or notValidated */
      switch (slideIndex) {
        case 0:
          pictogramsList = visiblePictograms
          break
        case 1:
          pictogramsList = pictograms.filter(pictogram => !pictogram.published)
          break
        case 2:
          pictogramsList = pictograms.filter(pictogram => !pictogram.validated)
          break
        default:
        // not used
      }
      pictogramsCounter = pictogramsList.length
      gallery = pictogramsCounter ? (
        <div>
          {/* <PictogramList
            pictograms={pictogramsList}
            locale={locale}
            filtersMap={filters}
            setFilterItems={this.props.setFilterItems}
            showLabels={visibleLabels}
            searchText={searchText}
          /> */}
        </div>
      ) : (
        this.renderNoPictos()
      )
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Tabs
            className={classes.tab}
            fullWidth
            value={slideIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={width === 'xs' ? '' : <FormattedMessage {...messages.search} />}
              icon={<SearchIcon />}
              value={0}
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
          {slideIndex === 0 && (
            <View>
              <SearchField
                value={searchText}
                onSubmit={this.handleSubmit}
                style={styles.searchBar}
                dataSource={keywords}
              />
              {gallery}
            </View>
          )}
          {slideIndex === 1 && <View>Item Two</View>}
          {slideIndex === 2 && <View>Item Three</View>}
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
  requestPictograms: PropTypes.func.isRequired,
  requestAllPictograms: PropTypes.func.isRequired,
  requestNewPictograms: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  visiblePictograms: PropTypes.arrayOf(PropTypes.object),
  locale: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.number),
  lastUpdated: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state),
  lastUpdated: makeLastUpdatedSelector()(state),
  searchResults: makeSearchResultsSelector()(state, ownProps),
  visiblePictograms: makeVisiblePictogramsSelector()(state, ownProps),
  keywords: makeKeywordsSelectorByLocale()(state),
  searchText: (() => ownProps.match.params.searchText || '')(),
})

const mapDispatchToProps = dispatch => ({
  requestPictograms: (locale, searchText) => {
    dispatch(pictograms.request(locale, searchText))
  },
  requestAllPictograms: locale => {
    dispatch(allPictograms.request(locale))
  },
  requestNewPictograms: (locale, lastUpdated) => {
    dispatch(newPictograms.request(locale, lastUpdated))
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

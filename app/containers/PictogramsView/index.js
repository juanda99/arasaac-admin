import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import qs from 'qs'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import withWidth from '@material-ui/core/withWidth'
import SearchIcon from '@material-ui/icons/Search'
import VisibilityIcon from '@material-ui/icons/VisibilityOff'
import ValidateIcon from '@material-ui/icons/ThumbDown'
import Tabs from '@material-ui/core/Tabs'
import Checkbox from '@material-ui/core/Checkbox'
import Tab from '@material-ui/core/Tab'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import View from 'components/View'
import SearchField from 'components/SearchField'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import { makeSelectUserRole } from 'containers/App/selectors'
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
      tab: 0,
      offset: 0,
      filters: {
        aac: false,
        violence: false,
        sex: false
      }
    }
  }

  processQuery = props => {
    const { location } = props || this.props
    let { search } = location
    let parameters = { offset: 0, tab: 0 }
    if (search) {
      search = search.slice(1) // remove ?
      parameters = { ...parameters, ...qs.parse(search) }
      const validKeys = ['offset', 'tab']
      Object.keys(parameters).forEach(key => validKeys.includes(key) || delete parameters[key])
      parameters.offset = parseInt(parameters.offset, 10)
      parameters.tab = parseInt(parameters.tab, 10)
    }
    const needUpdate = Object.keys(parameters).some(key => parameters[key] !== this.state[key])
    if (needUpdate) this.setState(parameters)
  }

  componentDidMount() {
    const { locale, searchText, searchResults, updated } = this.props
    this.processQuery()
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
    if (this.props.location.search !== nextProps.location.search) this.processQuery(nextProps)
  }

  handleSubmit = nextValue => {
    history.push(`/pictograms/search/${nextValue}`)
  }

  handleChange = (event, tab) => {
    const { pathname } = this.props.location
    const url = `${pathname}?tab=${tab}`
    this.props.history.push(url)
    // sessionStorage.setItem('pictoSlideIndex', slideIndex)
  }


  handlePageClick = offset => {
    // fix bug if offset is not number, click comes from picto link, should not be processed here
    if (typeof offset === 'number') {
      const { tab } = this.state
      const { pathname } = this.props.location
      const url = `${pathname}?offset=${offset}&tab=${tab}`
      this.props.history.push(url)
    }
  }

  handleDelete = () => history.push('/pictograms/')

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
      role
    } = this.props
    const { offset, tab,  sex, violence, aac } = this.state
    const filters = { sex,  violence, aac}
    const filterKeys = Object.keys(filters).filter(key=>filters[key])
    const filterPictograms = visiblePictograms.filter(item => filterKeys.every(key => item[key]))

    const searchBox = (
      <View>
        <SearchField
          value={searchText}
          onSubmit={this.handleSubmit}
          style={styles.searchBar}
          dataSource={keywords}
          onDelete={this.handleDelete}
        />
        {role === 'admin' && (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sex}
                  onChange={()=> this.setState({sex: !sex})}
                />
              }
              label="Mostrar sólo pictogramas de sexo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={violence}
                  onChange={()=> this.setState({violence: !violence})}
                />
              }
              label="Mostrar sólo pictogramas de violencia"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={aac}
                  onChange={()=> this.setState({aac: !aac})}
                />
              }
              label="Mostrar sólo pictogramas AAC"
            />
          </div>
        )}
      </View>
    )

    let renderComponent
    switch (tab) {
      case 0:
        if (loading === false) {
          renderComponent = (
            <>
              {filterPictograms.length ? (
                <PictogramList
                  pictograms={filterPictograms}
                  searchText={searchText}
                  offset={offset}
                  onPageClick={this.handlePageClick}
                />
              ) : (
                <View>
                  <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                    {<FormattedMessage {...messages.pictogramsNotFound} />}
                  </Typography>
                </View>
              )}
            </>
          )
        } else renderComponent = null

        break
      case 1:
        {
          // TODO: use reselect for memoization
          const unpublishedPictos = pictogramCollection.filter(pictogram => pictogram.published === false)
          renderComponent = (
            <>
              {unpublishedPictos.length ? (
                <PictogramList
                  pictograms={unpublishedPictos}
                  locale={locale}
                  searchText={searchText}
                  offset={offset}
                  onPageClick={this.handlePageClick}
                />
              ) : (
                <View>
                  <Typography variant="h6" component="h3" color="textPrimary" gutterBottom>
                    {<FormattedMessage {...messages.pictogramsNotFound} />}
                  </Typography>
                </View>
              )}
            </>
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
              offset={offset}
              onPageClick={this.handlePageClick}
            />
          )
        }
        break
      default:
      // not used
    }
    return (
      <div className={classes.root}>
        <Tabs
          className={classes.tab}
          variant="fullWidth"
          value={tab}
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
        {tab === 0 && searchBox}
        {renderComponent}
      </div>
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
  role: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state),
  role: makeSelectUserRole()(state),
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

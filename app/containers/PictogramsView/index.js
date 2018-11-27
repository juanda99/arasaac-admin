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
import TabContainer from 'components/TabContainer'
import SearchField from 'components/SearchField'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import {
  makeLoadingSelector,
  makeSearchResultsSelector,
  makeVisiblePictogramsSelector,
  makeKeywordsSelectorByLocale,
} from './selectors'
import { autocomplete, pictograms } from './actions'
import styles from './styles'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */

class PictogramsView extends React.PureComponent {
  state = {
    slideIndex: 0,
  }

  componentDidMount() {
    const { requestPictograms, requestAutocomplete, locale, searchText, searchResults } = this.props
    if (searchText && !searchResults) {
      requestPictograms(locale, searchText)
    }
    requestAutocomplete(locale)
  }

  handleSubmit = nextValue => {
    this.setState({
      slideIndex: 0,
    })
    if (this.props.params.searchText !== nextValue) {
      this.props.router.push(`/pictograms/search/${nextValue}`)
    }
  }

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex })
  }

  render() {
    const { classes, width, searchText, keywords } = this.props
    const { slideIndex } = this.state
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Tabs value={slideIndex} onChange={this.handleChange}>
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
            <TabContainer>
              <SearchField
                value={searchText}
                onSubmit={this.handleSubmit}
                style={styles.searchBar}
                dataSource={keywords}
              />
            </TabContainer>
          )}
          {slideIndex === 1 && <TabContainer>Item Two</TabContainer>}
          {slideIndex === 2 && <TabContainer>Item Three</TabContainer>}
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
  searchText: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  visiblePictograms: PropTypes.arrayOf(PropTypes.object),
  locale: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.number),
}

const mapStateToProps = (state, ownProps) => ({
  locale: makeSelectLocale()(state),
  loading: makeLoadingSelector()(state),
  searchResults: makeSearchResultsSelector()(state, ownProps),
  visiblePictograms: makeVisiblePictogramsSelector()(state, ownProps),
  keywords: makeKeywordsSelectorByLocale()(state),
  searchText: (() => ownProps.match.params.searchText || '')(),
})

const mapDispatchToProps = dispatch => ({
  requestPictograms: (locale, searchText) => {
    dispatch(pictograms.request(locale, searchText))
  },
  requestAutocomplete: locale => {
    dispatch(autocomplete.request(locale))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withWidth()(PictogramsView)))

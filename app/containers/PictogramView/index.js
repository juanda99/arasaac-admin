import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { compose } from 'redux'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import history from 'utils/history'
import reducer from '../PictogramsView/reducer'
import saga from '../PictogramsView/sagas'
import styles from './styles'
import {
  makeLoadingSelector,
  makeSearchResultsSelector,
  makeVisiblePictogramsSelector,
  makeKeywordsSelectorByLocale,
} from '../PictogramsView/selectors'
import { autocomplete, pictograms } from '../PictogramsView/actions'

/* eslint-disable react/prefer-stateless-function */

class PictogramView extends React.PureComponent {
  componentDidMount() {
    const { requestPictograms, requestAutocomplete, locale, searchText, searchResults } = this.props
    if (searchText && !searchResults) {
      requestPictograms(locale, searchText)
    }
    requestAutocomplete(locale)
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

  render() {
    return (
      <React.Fragment>
        <p>PictogramView</p>
      </React.Fragment>
    )
  }
}

PictogramView.propTypes = {
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'pictogramsView', reducer })
const withSaga = injectSaga({ key: 'pictogramsView', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(PictogramView)))

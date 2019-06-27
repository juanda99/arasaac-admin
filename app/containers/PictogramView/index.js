import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { makeSelectHasUser } from 'containers/UsersView/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import View from 'components/View'
import Pictogram from 'components/Pictogram'
import { TreeSelect } from 'antd/lib/tree-select'
import 'antd/dist/antd.css'
import treeData from './treeData.js'
import reducer from '../PictogramsView/reducer'
import saga from '../PictogramsView/sagas'
import styles from './styles'
import { makeLoadingSelector, makeSelectIdPictogram, makePictogramByIdSelector } from '../PictogramsView/selectors'
import { pictogram } from './actions'

/* eslint-disable react/prefer-stateless-function */

class PictogramView extends React.PureComponent {
  state = {
    value: undefined,
  }

  onChange = value => {
    this.setState({ value })
  }

  componentDidMount() {
    const { requestPictogram, idPictogram, locale, selectedPictogram } = this.props
    if (!selectedPictogram) {
      requestPictogram(idPictogram, locale)
    }
  }

  componentWillReceiveProps(nextProps) {
    // we can change origin/target language, so we should get
    // pictogram data in that language
  }

  render() {
    const { selectedPictogram, locale } = this.props
    console.log(`Selected pictogram: ${selectedPictogram}`)
    return (
      <View>
        <h2>Categorías pictograma</h2>
        <Pictogram pictogram={selectedPictogram} locale={locale} />
        <TreeSelect
          style={{ width: '100%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Please select"
          onChange={this.onChange}
          multiple
        />
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
}

const mapStateToProps = (state, ownProps) => ({
  loading: makeLoadingSelector()(state),
  selectedPictogram: makePictogramByIdSelector()(state, ownProps),
  locale: makeSelectLocale()(state),
  token: makeSelectHasUser()(state),
  idPictogram: makeSelectIdPictogram()(state, ownProps),
})

const mapDispatchToProps = dispatch => ({
  requestPictogram: (locale, searchText) => {
    dispatch(pictogram.request(locale, searchText))
  },
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)
const withReducer = injectReducer({ key: 'pictogramsView', reducer })
const withSaga = injectSaga({ key: 'pictogramView', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles, { withTheme: true })(withWidth()(PictogramView)))

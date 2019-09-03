import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import View from 'components/View'
import { withStyles } from '@material-ui/core/styles'
import jp from 'jsonpath'
import ListTree from 'components/ListTree'
import cloneDeep from 'lodash/cloneDeep'
import injectReducer from 'utils/injectReducer'
import { DAEMON } from 'utils/constants'
import injectSaga from 'utils/injectSaga'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import XLSX from 'xlsx'
import CustomDropzone from './CustomDropzone'
// import DragDropFile from './DragDropFile'
import OutTable from './OutTable'
import styles from './styles'
import { categories, categoriesUpdate, categoriesAdd, categoriesDelete, categoriesImport } from './actions'
import { makeLoadingSelector, makeCategoriesSelectorByLocale, makeLastUpdatedSelectorByLocale } from './selectors'
import reducer from './reducer'
import messages from './messages'
import saga from './sagas'

/* eslint-disable react/prefer-stateless-function */

/* generate an array of column objects */
const make_cols = refstr => {
  const o = []

  const C = XLSX.utils.decode_range(refstr).e.c + 1
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
  return o
}

class CategoriesView extends React.PureComponent {
  state = {
    category: '',
    data: [] /* Array of Arrays for excel files [["a","b"],[1,2]] */,
    cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */,
  }

  componentDidMount() {
    const { locale, lastUpdated } = this.props
    this.props.requestCategories(locale, lastUpdated)
  }

  handleSelect = category => {
    // const category = data.selectedKeys[0]
    this.setState({ category })
  }

  // handleDelete = item => removeKeys(categories, item)
  // TODO: remove also from relationsships!!!

  handleAdd = (data, parentItem) => {
    const { locale, requestCategoriesAdd } = this.props
    requestCategoriesAdd('shouldBeToken', locale, parentItem, data)
  }

  handleUpdate = (data, item) => {
    const { locale, requestCategoriesUpdate } = this.props
    requestCategoriesUpdate('shouldBeToken', locale, item, data)
  }

  handleDelete = item => {
    // TODO: Add warning before delete:
    const { locale, requestCategoriesDelete } = this.props
    requestCategoriesDelete('shouldBeToken', locale, item)
  }

  handleFile = (file /* :File */) => {
    const { categories, requestCategoriesImport } = this.props
    const { data } = categories
    let dirty = false
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const newData = XLSX.utils.sheet_to_json(ws, { header: 1 })
      newData.forEach((category, index) => {
        console.log(category, index)
        if (index === 0) return // this is header, not data!
        const key = category[0]
        const tag = category[1]
        console.log(`category2: ${category[2]}`)
        let keywords = category[2]
          .split(',')
          .map(value => value.trim())
          .filter(Boolean) // remove empty values
        keywords = [...new Set(keywords)] // remove duplicates
        console.log('00000000000')
        console.log(`data and key: ${key}: ${JSON.stringify(data, null, 2)}`)
        // change to get also keys with spaces:
        // const subData = jp.value(data, `$..${key}`)
        const subData = jp.value(data, `$..["${key}"]`)
        console.log('10000000000')

        console.log(`subData with key: ${key}: ${JSON.stringify(subData, null, 2)}`)
        if (subData) {
          subData.tag = tag
          subData.keywords = keywords
          dirty = true
        }
        console.log(`subData after...: ${JSON.stringify(subData, null, 2)}`)
      })
      // optimistic, set state and then call api:
      if (dirty) requestCategoriesImport('shouldbeJSONToken', categories)

      /* Update state */
      // this.setState({ data, cols: make_cols(ws['!ref']) })
    }
    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)
  }

  exportFile = () => {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(this.state.data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, 'sheetjs.xlsx')
  }

  render() {
    const { category } = this.state
    const { data } = this.props.categories
    // const data = category ? jp.value(categories, `$..${category}`) : {}
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
        <h2>Importar y exportar datos</h2>

        <CustomDropzone handleFile={this.handleFile} />
        <div>
          <button disabled={!this.state.data.length} className="btn btn-success" onClick={this.exportFile}>
            Export
          </button>
        </div>
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

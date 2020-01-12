/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { Map } from 'immutable'
import jp from 'jsonpath'
import { languages } from 'utils/index'
import { CATEGORIES, CATEGORIES_UPDATE, CATEGORIES_DELETE, CATEGORIES_ADD, REMOVE_ERROR } from './actions'

const langReducer = {}
languages.forEach(language => {
  langReducer[language.code] = {}
})

export const initialState = Map({
  loading: false,
  error: '',
  categories: {
    ...langReducer,
  },
})

const categoriesViewReducer = (state = initialState, action) => {
  let categories
  switch (action.type) {
    case CATEGORIES.REQUEST:
    case CATEGORIES_UPDATE.REQUEST:
    case CATEGORIES_DELETE.REQUEST:
    case CATEGORIES_ADD.REQUEST:
      return state.set('loading', true).set('error', '')
    case CATEGORIES.SUCCESS:
    case CATEGORIES_UPDATE.SUCCESS:
    case CATEGORIES_DELETE.SUCCESS:
    case CATEGORIES_ADD.SUCCESS:
      if (Object.entries(action.payload.data).length === 0 && action.payload.data.constructor === Object)
        return state.set('loading', false)
      const { locale } = action.payload.data
      categories = state.get('categories')
      categories[locale] = action.payload.data
      const tmpKeywords = categories ? jp.query(categories, '$..keywords') : []
      const keywords = [].concat(...tmpKeywords)
      categories[locale].keywords = [...new Set(keywords)]
      // get tags
      const tmpTags = categories ? jp.query(categories, '$..tags') : []
      const tags = [].concat(...tmpTags)
      categories[locale].tags = [...new Set(tags)]
      return state.set('categories', categories).set('loading', false)
    case CATEGORIES.FAILURE:
    case CATEGORIES_UPDATE.FAILURE:
    case CATEGORIES_DELETE.FAILURE:
    case CATEGORIES_ADD.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case REMOVE_ERROR:
      return state.set('error', '')
    default:
      return state
  }
}

export default categoriesViewReducer

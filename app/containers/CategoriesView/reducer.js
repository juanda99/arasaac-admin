/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { Map } from 'immutable'
import { CATEGORIES, CATEGORIES_UPDATE, CATEGORIES_DELETE, CATEGORIES_ADD, CATEGORIES_IMPORT } from './actions'
export const initialState = Map({
  loading: false,
  error: false,
  categories: {
    es: {},
    en: {},
    fr: {},
    ro: {},
    ru: {},
    pl: {},
    zh: {},
    bg: {},
    ca: {},
    ar: {},
    it: {},
    hr: {},
    pt: {},
    de: {},
    eu: {},
    br: {},
    gl: {},
    val: {},
  },
})

const categoriesViewReducer = (state = initialState, action) => {
  let categories
  switch (action.type) {
    case CATEGORIES.REQUEST:
    case CATEGORIES_UPDATE.REQUEST:
    case CATEGORIES_DELETE.REQUEST:
    case CATEGORIES_ADD.REQUEST:
    case CATEGORIES_IMPORT.REQUEST:
      return state.set('loading', true).set('error', false)
    case CATEGORIES.SUCCESS:
    case CATEGORIES_UPDATE.SUCCESS:
    case CATEGORIES_DELETE.SUCCESS:
    case CATEGORIES_ADD.SUCCESS:
    case CATEGORIES_IMPORT.SUCCESS:
      if (Object.entries(action.payload.data).length === 0 && action.payload.data.constructor === Object)
        return state.set('loading', false)
      const { locale } = action.payload.data
      categories = state.get('categories')
      categories[locale] = action.payload.data
      return state.set('loading', false).set('categories', categories)
    case CATEGORIES.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)

    default:
      return state
  }
}

export default categoriesViewReducer

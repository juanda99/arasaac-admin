/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { Map } from 'immutable'
import { CATEGORIES, CATEGORIES_UPDATE, CATEGORIES_DELETE, CATEGORIES_ADD } from './actions'
export const initialState = Map({
  loading: false,
  error: false,
  categories: {
    es: {},
    en: {},
    fr: {},
  },
})

const categoriesViewReducer = (state = initialState, action) => {
  let categories
  switch (action.type) {
    case CATEGORIES.REQUEST:
      return state.set('loading', true).set('error', false)
    case CATEGORIES.SUCCESS:
    case CATEGORIES_UPDATE.SUCCESS:
    case CATEGORIES_DELETE.SUCCESS:
    case CATEGORIES_ADD.SUCCESS:
      categories = state.get('categories')
      categories[action.payload.locale] = action.payload.data
      return state.set('loading', false).set('categories', categories)
    case CATEGORIES.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)

    default:
      return state
  }
}

export default categoriesViewReducer

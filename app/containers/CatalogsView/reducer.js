/*
 *
 * PictogramsView reducer
 *
 */

import { fromJS } from 'immutable'
import { CATALOGS, GENERATE_CATALOG, GENERATE_ALL_CATALOGS } from './actions'

export const initialState = fromJS({
  loading: false,
  error: false,
  status: {},
})

const catalogsViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATALOGS.REQUEST:
      return state.set('loading', true).set('error', false)
    case CATALOGS.SUCCESS:
      return state.set('loading', false).set('status', action.payload)
    case CATALOGS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    default:
      return state
  }
}

export default catalogsViewReducer

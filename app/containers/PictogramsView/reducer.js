/*
 *
 * PictogramsView reducer
 *
 */

import { fromJS } from 'immutable'
import { PICTOGRAM } from 'containers/PictogramView/actions'
import { PICTOGRAMS, AUTOCOMPLETE } from './actions'

export const initialState = fromJS({
  loading: false,
  error: false,
  search: {},
  words: {},
  searchText: '',
  pictograms: { es: {}, en: {}, fr: {} },
})

const pictogramsViewReducer = (state = initialState, action) => {
  let newPictogram = {}
  let idPictogram
  switch (action.type) {
    case PICTOGRAM.REQUEST:
      return state.set('loading', true).set('error', false)
    case PICTOGRAM.SUCCESS:
      newPictogram = fromJS(action.payload.data || {})
      idPictogram = action.payload.data.idPictogram.toString()
      return state.set('loading', false).setIn(['pictograms', action.payload.locale, idPictogram], newPictogram)
    case PICTOGRAM.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case PICTOGRAMS.REQUEST:
      return state.set('loading', true).set('error', false)
    case PICTOGRAMS.SUCCESS:
      newPictogram = fromJS(action.payload.data.entities.pictograms || {})
      return state
        .set('loading', false)
        .setIn(['search', action.payload.locale, action.payload.searchText], action.payload.data.result)
        .mergeIn(['pictograms', action.payload.locale], newPictogram)
    case PICTOGRAMS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case AUTOCOMPLETE.REQUEST:
      return state
    case AUTOCOMPLETE.SUCCESS:
      return state.setIn(['words', action.payload.locale], action.payload.data)
    case AUTOCOMPLETE.FAILURE:
      return state.set('error', action.payload.error)
    default:
      return state
  }
}

export default pictogramsViewReducer

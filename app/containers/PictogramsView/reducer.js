/*
 *
 * PictogramsView reducer
 *
 */

import { fromJS, Map } from 'immutable'
import { PICTOGRAM, PICTOGRAM_UPDATE } from 'containers/PictogramView/actions'
import { PICTOGRAMS, AUTOCOMPLETE, NEW_PICTOGRAMS, REMOVE_ERROR } from './actions'

export const initialState = fromJS({
  loading: false,
  error: false,
  search: {},
  words: {},
  searchText: '',
  ar: { updated: '', pictograms: {} },
  bg: { updated: '', pictograms: {} },
  br: { updated: '', pictograms: {} },
  ca: { updated: '', pictograms: {} },
  de: { updated: '', pictograms: {} },
  en: { updated: '', pictograms: {} },
  es: { updated: '', pictograms: {} },
  eu: { updated: '', pictograms: {} },
  fr: { updated: '', pictograms: {} },
  gl: { updated: '', pictograms: {} },
  hr: { updated: '', pictograms: {} },
  he: { updated: '', pictograms: {} },
  it: { updated: '', pictograms: {} },
  nl: { updated: '', pictograms: {} },
  pl: { updated: '', pictograms: {} },
  pt: { updated: '', pictograms: {} },
  ro: { updated: '', pictograms: {} },
  ru: { updated: '', pictograms: {} },
  val: { updated: '', pictograms: {} },
  zh: { updated: '', pictograms: {} },
})

const pictogramsViewReducer = (state = initialState, action) => {
  let newPictogram = {}
  let idPictogram
  switch (action.type) {
    case PICTOGRAM.REQUEST:
    case PICTOGRAM_UPDATE.REQUEST:
    case PICTOGRAMS.REQUEST:
    case NEW_PICTOGRAMS.REQUEST:
      return state.set('loading', true).set('error', '')
    case PICTOGRAMS.SUCCESS:
      newPictogram = Map(action.payload.data.entities.pictograms || {})
      return state
        .set('loading', false)
        .setIn(['search', action.payload.locale, action.payload.searchText], action.payload.data.result)
        .mergeIn([action.payload.locale, 'pictograms'], newPictogram)
    case NEW_PICTOGRAMS.SUCCESS:
      newPictogram = Map(action.payload.data.entities.pictograms || {})
      return state
        .set('loading', false)
        .mergeIn([action.payload.locale, 'updated'], action.payload.updated)
        .mergeIn([action.payload.locale, 'pictograms'], newPictogram)
    case PICTOGRAM.SUCCESS:
    case PICTOGRAM_UPDATE.SUCCESS:
      newPictogram = action.payload.data || {}
      idPictogram = action.payload.data._id.toString()
      return state.set('loading', false).setIn([action.payload.locale, 'pictograms', idPictogram], newPictogram)
    case PICTOGRAM.FAILURE:
    case PICTOGRAM_UPDATE.FAILURE:
    case PICTOGRAMS.FAILURE:
    case NEW_PICTOGRAMS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case AUTOCOMPLETE.REQUEST:
      return state
    case AUTOCOMPLETE.SUCCESS:
      return state.setIn(['words', action.payload.locale], action.payload.data)
    case AUTOCOMPLETE.FAILURE:
      return state.set('error', action.payload.error)
    case REMOVE_ERROR:
      return state.set('error', '')
    default:
      return state
  }
}

export default pictogramsViewReducer

/*
 *
 * PictogramsView reducer
 *
 */

import { fromJS, Map } from 'immutable'
import { PICTOGRAM, PICTOGRAM_UPDATE, PICTOGRAM_DELETE } from 'containers/PictogramView/actions'
import { languages } from 'utils/index'
import { PICTOGRAMS, AUTOCOMPLETE, NEW_PICTOGRAMS, REMOVE_ERROR } from './actions'

const langReducer = {}
languages.forEach(language => {
  langReducer[language.code] = { updated: '', pictograms: {} }
})

export const initialState = fromJS({
  loading: false,
  error: false,
  search: {},
  words: {},
  searchText: '',
  ...langReducer,
})

const pictogramsViewReducer = (state = initialState, action) => {
  let newPictogram = {}
  let idPictogram
  switch (action.type) {
    case PICTOGRAM.REQUEST:
    case PICTOGRAM_UPDATE.REQUEST:
    case PICTOGRAMS.REQUEST:
    case NEW_PICTOGRAMS.REQUEST:
    case PICTOGRAM_DELETE:
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
      // same as update, but if pictogram does not exist, toString gives error
      newPictogram = action.payload.data || {}
      idPictogram = action.payload.data._id
      if (idPictogram) {
        return state
          .set('loading', false)
          .setIn([action.payload.locale, 'pictograms', idPictogram.toString()], newPictogram)
      }
      return state.set('loading', false)

    case PICTOGRAM_UPDATE.SUCCESS:
      newPictogram = action.payload.data || {}
      idPictogram = action.payload.data._id.toString()
      return state.set('loading', false).setIn([action.payload.locale, 'pictograms', idPictogram], newPictogram)
    case PICTOGRAM_DELETE.SUCCESS: {
      idPictogram = action.payload.idPictogram
      let tmpState = state
      languages.forEach(language => {
        tmpState = tmpState.deleteIn([language.code, 'pictograms', idPictogram])
      })
      return tmpState.set('loading', false)
    }
    case PICTOGRAM.FAILURE:
    case PICTOGRAM_UPDATE.FAILURE:
    case PICTOGRAMS.FAILURE:
    case NEW_PICTOGRAMS.FAILURE:
    case PICTOGRAM_DELETE.FAILURE:
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

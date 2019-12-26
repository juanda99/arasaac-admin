/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable'

import { CHANGE_LOCALE } from './constants'
import { DEFAULT_LOCALE } from '../../i18n'; // eslint-disable-line

export const initialState = fromJS({
  locale: DEFAULT_LOCALE,
  direction: 'ltr',
})

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE: {
      const direction = action.locale === 'ar' || action.locale === 'he' ? 'rtl' : 'ltr'
      return state.set('locale', action.locale).set('direction', direction)
    }
    default:
      return state
  }
}

export default languageProviderReducer

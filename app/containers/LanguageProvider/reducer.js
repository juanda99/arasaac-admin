/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable'

import { CHANGE_LOCALE } from './constants'
import { DEFAULT_LOCALE } from '../../i18n' // eslint-disable-line

const getDirection = locale => (locale === 'ar' || locale === 'he' || locale === 'fa' ? 'rtl' : 'ltr')

export const initialState = fromJS({
  locale: DEFAULT_LOCALE,
  direction: getDirection(DEFAULT_LOCALE),
})

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE: {
      const direction = getDirection(action.locale)
      return state.set('locale', action.locale).set('direction', direction)
    }
    default:
      return state
  }
}

export default languageProviderReducer

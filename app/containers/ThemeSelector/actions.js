/*
 *
 * LanguageProvider actions
 *
 */

import { CHANGE_THEME } from './constants'

export const changeTheme = theme => ({
  type: CHANGE_THEME,
  theme,
})

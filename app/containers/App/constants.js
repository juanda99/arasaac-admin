/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const appLocales = ['en', 'es', 'fr', 'it', 'de']
const navigatorLanguage = navigator.language.split('-')[0] // es-ES get reduced to es
<<<<<<< HEAD
export const DEFAULT_LOCALE = appLocales.includes(navigatorLanguage) ? navigatorLanguage : 'en'
=======
export const DEFAULT_LOCALE = appLocales.includes(navigatorLanguage)
  ? navigatorLanguage
  : 'en'
>>>>>>> 54d44538ffd50844bc99a330b250a267c0477d61

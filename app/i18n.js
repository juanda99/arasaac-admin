/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */

// const frTranslationMessages = require('./translations/fr.json')
// const itTranslationMessages = require('./translations/it.json')
// const deTranslationMessages = require('./translations/de.json')
// const valTranslationMessages = require('./translations/val.json')
// const afTranslationMessages = require('./translations/af.json')

const DEFAULT_LOCALE = 'en'
// import { DEFAULT_LOCALE } from './containers/App/constants'
// const { DEFAULT_LOCALE } = require('./containers/App/constants')
const caTranslationMessages = require('./translations/ca.json')
const enTranslationMessages = require('./translations/en.json')
const esTranslationMessages = require('./translations/es.json')
const frTranslationMessages = require('./translations/fr.json')
const glTranslationMessages = require('./translations/gl.json')
const heTranslationMessages = require('./translations/he.json')
const hrTranslationMessages = require('./translations/hr.json')
const huTranslationMessages = require('./translations/hu.json')
const itTranslationMessages = require('./translations/it.json')
const ptTranslationMessages = require('./translations/pt.json')
const ruTranslationMessages = require('./translations/ru.json')
const skTranslationMessages = require('./translations/sk.json')
const valTranslationMessages = require('./translations/val.json')

// prettier-ignore
const appLocales = [
  'ca',
  'en',
  'es',
  'fr',
  'gl',
  'he',
  'hr',
  'hu',
  'it',
  'pt',
  'ru',
  'sk',
  'val',
];

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages) : {}
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key]
    return Object.assign(formattedMessages, { [key]: formattedMessage })
  }
  return Object.keys(messages).reduce(flattenFormattedMessages, {})
}

const translationMessages = {
  ca: formatTranslationMessages('ca', caTranslationMessages),
  en: formatTranslationMessages('en', enTranslationMessages),
  es: formatTranslationMessages('es', esTranslationMessages),
  fr: formatTranslationMessages('fr', frTranslationMessages),
  gl: formatTranslationMessages('gl', glTranslationMessages),
  he: formatTranslationMessages('he', heTranslationMessages),
  hr: formatTranslationMessages('hr', hrTranslationMessages),
  hu: formatTranslationMessages('hu', huTranslationMessages),
  it: formatTranslationMessages('it', itTranslationMessages),
  pt: formatTranslationMessages('pt', ptTranslationMessages),
  ru: formatTranslationMessages('ru', ruTranslationMessages),
  sk: formatTranslationMessages('sk', skTranslationMessages),
  val: formatTranslationMessages('val', valTranslationMessages),
  // de: formatTranslationMessages('de', deTranslationMessages),s
  // af: formatTranslationMessages('af', afTranslationMessages),
}

exports.appLocales = appLocales
exports.formatTranslationMessages = formatTranslationMessages
exports.translationMessages = translationMessages
exports.DEFAULT_LOCALE = DEFAULT_LOCALE

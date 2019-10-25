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

import { DEFAULT_LOCALE } from './containers/App/constants'
const enTranslationMessages = require('./translations/en.json')
const esTranslationMessages = require('./translations/es.json')

// prettier-ignore
const appLocales = [
  'en',
  'es',
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
  en: formatTranslationMessages('en', enTranslationMessages),
  es: formatTranslationMessages('es', esTranslationMessages),
  // fr: formatTranslationMessages('fr', frTranslationMessages),
  // it: formatTranslationMessages('it', itTranslationMessages),
  // de: formatTranslationMessages('de', deTranslationMessages),
  // val: formatTranslationMessages('val', valTranslationMessages),
  // af: formatTranslationMessages('af', afTranslationMessages),
}

exports.appLocales = appLocales
exports.formatTranslationMessages = formatTranslationMessages
exports.translationMessages = translationMessages
exports.DEFAULT_LOCALE = DEFAULT_LOCALE

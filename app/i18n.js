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
const anTranslationMessages = require('./translations/an.json')
const arTranslationMessages = require('./translations/ar.json')
const bgTranslationMessages = require('./translations/bg.json')
const caTranslationMessages = require('./translations/ca.json')
const deTranslationMessages = require('./translations/de.json')
const elTranslationMessages = require('./translations/el.json')
const enTranslationMessages = require('./translations/en.json')
const esTranslationMessages = require('./translations/es.json')
const etTranslationMessages = require('./translations/et.json')
const euTranslationMessages = require('./translations/eu.json')
const faTranslationMessages = require('./translations/fa.json')
const frTranslationMessages = require('./translations/fr.json')
const glTranslationMessages = require('./translations/gl.json')
const heTranslationMessages = require('./translations/he.json')
const hrTranslationMessages = require('./translations/hr.json')
const huTranslationMessages = require('./translations/hu.json')
const koTranslationMessages = require('./translations/ko.json')
const ltTranslationMessages = require('./translations/lt.json')
const lvTranslationMessages = require('./translations/lv.json')
const itTranslationMessages = require('./translations/it.json')
const mkTranslationMessages = require('./translations/mk.json')
const nlTranslationMessages = require('./translations/nl.json')
const plTranslationMessages = require('./translations/pl.json')
const ptTranslationMessages = require('./translations/pt.json')
const roTranslationMessages = require('./translations/ro.json')
const ruTranslationMessages = require('./translations/ru.json')
const skTranslationMessages = require('./translations/sk.json')
const svTranslationMessages = require('./translations/sv.json')
const srTranslationMessages = require('./translations/sr.json')
const sqTranslationMessages = require('./translations/sq.json')
const valTranslationMessages = require('./translations/val.json')
const zhTranslationMessages = require('./translations/zh.json')

// prettier-ignore
const appLocales = [
  'an',
  'ar',
  'bg',
  'br',
  'ca',
  'de',
  'el',
  'en',
  'es',
  'et',
  'eu',
  'fa',
  'fr',
  'gl',
  'he',
  'hr',
  'hu',
  'it',
  'ko',
  'lt',
  'lv',
  'mk',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sv',
  'sr',
  'sq',
  'val',
  'zh',
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
  an: formatTranslationMessages('an', anTranslationMessages),
  ar: formatTranslationMessages('ar', arTranslationMessages),
  bg: formatTranslationMessages('bg', bgTranslationMessages),
  br: formatTranslationMessages('br', ptTranslationMessages),
  ca: formatTranslationMessages('ca', caTranslationMessages),
  de: formatTranslationMessages('de', deTranslationMessages),
  el: formatTranslationMessages('el', elTranslationMessages),
  en: formatTranslationMessages('en', enTranslationMessages),
  es: formatTranslationMessages('es', esTranslationMessages),
  et: formatTranslationMessages('et', etTranslationMessages),
  eu: formatTranslationMessages('eu', euTranslationMessages),
  fa: formatTranslationMessages('fa', faTranslationMessages),
  fr: formatTranslationMessages('fr', frTranslationMessages),
  gl: formatTranslationMessages('gl', glTranslationMessages),
  he: formatTranslationMessages('he', heTranslationMessages),
  hr: formatTranslationMessages('hr', hrTranslationMessages),
  hu: formatTranslationMessages('hu', huTranslationMessages),
  it: formatTranslationMessages('it', itTranslationMessages),
  ko: formatTranslationMessages('ko', koTranslationMessages),
  lt: formatTranslationMessages('lt', ltTranslationMessages),
  lv: formatTranslationMessages('lv', lvTranslationMessages),
  mk: formatTranslationMessages('mk', mkTranslationMessages),
  nl: formatTranslationMessages('nl', nlTranslationMessages),
  pl: formatTranslationMessages('pl', plTranslationMessages),
  pt: formatTranslationMessages('pt', ptTranslationMessages),
  ro: formatTranslationMessages('ro', roTranslationMessages),
  ru: formatTranslationMessages('ru', ruTranslationMessages),
  sk: formatTranslationMessages('sk', skTranslationMessages),
  sq: formatTranslationMessages('sq', sqTranslationMessages),
  sv: formatTranslationMessages('sv', svTranslationMessages),
  sr: formatTranslationMessages('sr', srTranslationMessages),
  val: formatTranslationMessages('val', valTranslationMessages),
  zh: formatTranslationMessages('zh', zhTranslationMessages),
  // af: formatTranslationMessages('af', afTranslationMessages),
}

exports.appLocales = appLocales
exports.formatTranslationMessages = formatTranslationMessages
exports.translationMessages = translationMessages
exports.DEFAULT_LOCALE = DEFAULT_LOCALE

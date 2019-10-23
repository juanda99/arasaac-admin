import { createSelector } from 'reselect'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'

const selectCategoriesViewDomain = state => state.get('categoriesView')

export const makeLoadingSelector = () => createSelector(selectCategoriesViewDomain, substate => substate.get('loading'))
export const makeErrorSelector = () => createSelector(selectCategoriesViewDomain, substate => substate.get('error'))

const makeCategoriesSelector = () => createSelector(selectCategoriesViewDomain, substate => substate.get('categories'))

export const makeCategoriesSelectorByLocale = () =>
  createSelector(makeCategoriesSelector(), makeSelectLocale(), (substate, locale) => substate[locale])
// createSelector(makeCategoriesSelector(), makeSelectLocale(), (substate, locale) => substate.get(locale))

export const makeCategoriesSelectorByLanguage = language =>
  createSelector(makeCategoriesSelector(), substate => substate[language])

export const makeLastUpdatedSelectorByLocale = () =>
  createSelector(makeCategoriesSelector(), makeSelectLocale(), (substate, locale) => substate[locale].lastUpdated || '')

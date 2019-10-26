import { denormalize } from 'normalizr'
import { createSelector } from 'reselect'
import { searchPictogramSchema } from 'services/schemas'
import { getFilteredItems } from 'utils'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import { Map } from 'immutable'

const PICTOGRAMS = 'pictograms'
const LAST_UPDATED = 'updated'

export const selectPictogramsViewDomain = state => state.get('pictogramsView')

export const makeLoadingSelector = () => createSelector(selectPictogramsViewDomain, substate => substate.get('loading'))

const makeKeywordsSelector = () => createSelector(selectPictogramsViewDomain, substate => substate.get('words'))

export const makeKeywordsSelectorByLocale = () =>
  createSelector(makeKeywordsSelector(), makeSelectLocale(), (substate, locale) => substate.get(locale))

export const makeShowFiltersSelector = () =>
  createSelector(selectPictogramsViewDomain, substate => substate.get('showFilter'))

export const makeFiltersSelector = () => createSelector(selectPictogramsViewDomain, substate => substate.get('filters'))

const makePictogramsSelector = () =>
  createSelector(
    selectPictogramsViewDomain,
    makeSelectLocale(),
    (substate, locale) =>
      // pictograms.locale does not exists first time, just pictograms
      substate.getIn([locale, PICTOGRAMS]) || new Map(),
  )

export const makeSelectIdPictogram = () => (_, ownProps) => ownProps.match.params.idPictogram

export const makePictogramByIdSelector = () =>
  createSelector(
    makePictogramsSelector(),
    makeSelectIdPictogram(),
    // eslint-disable-next-line no-underscore-dangle
    (substate, idPictogram) => substate.get(idPictogram),
  )

export const makePictogramsListSelector = () =>
  createSelector(selectPictogramsViewDomain, makeSelectLocale(), (substate, locale) => {
    // pictograms.locale does not exists first time, just pictograms
    const pictograms = substate.getIn([locale, PICTOGRAMS]) || new Map()
    return pictograms.valueSeq().toArray()
  })

export const makeLastUpdatedSelector = () =>
  createSelector(
    selectPictogramsViewDomain,
    makeSelectLocale(),
    (substate, locale) => substate.getIn([locale, LAST_UPDATED]) || '',
  )

const makeSearchSelector = () => createSelector(selectPictogramsViewDomain, substate => substate.get('search'))

const makeSearchTextSelector = () => (_, ownProps) => ownProps.match.params.searchText

export const makeSearchResultsSelector = () =>
  createSelector(makeSearchSelector(), makeSelectLocale(), makeSearchTextSelector(), (pictograms, locale, searchText) =>
    pictograms.getIn([locale, searchText]),
  )

const makeEntitiesSelector = () =>
  createSelector(makePictogramsSelector(), pictograms => {
    const entities = {}
    entities.pictograms = pictograms.toJS()
    return entities
  })

export const makeVisiblePictogramsSelector = () =>
  createSelector(
    makeSearchResultsSelector(),
    makeEntitiesSelector(),
    // makeFiltersSelector(),
    (searchData, entities /* , filters */) => {
      /* searchData could be undefined */
      if (searchData == null) return []
      const pictogramList = denormalize(searchData, searchPictogramSchema, entities)
      return pictogramList
      // return getFilteredItems(pictogramList, filters)
    },
  )

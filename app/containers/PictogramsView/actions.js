import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAMS = createRequestTypes('PICTOGRAMS')
export const NOT_PUBLISHED_PICTOGRAMS = createRequestTypes('NOT_PUBLISHED_PICTOGRAMS')
export const NOT_VALIDATED_PICTOGRAMS = createRequestTypes('NOT_VALIDATED_PICTOGRAMS')
export const NEW_PICTOGRAMS = createRequestTypes('NEW_PICTOGRAMS')
export const AUTOCOMPLETE = createRequestTypes('AUTOCOMPLETE')
export const REMOVE_ERROR = 'REMOVE_ERROR'
// actions: pictograms.request/success/failure

export const pictograms = {
  request: (locale, searchText) => action(PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(PICTOGRAMS.FAILURE, { error }),
}

export const newPictograms = {
  request: (locale, updated) => action(NEW_PICTOGRAMS.REQUEST, { locale, updated }),
  success: (locale, data, updated) => action(NEW_PICTOGRAMS.SUCCESS, { locale, data, updated }),
  failure: error => action(NEW_PICTOGRAMS.FAILURE, { error }),
}

export const autocomplete = {
  request: locale => action(AUTOCOMPLETE.REQUEST, { locale }),
  success: (locale, data) => action(AUTOCOMPLETE.SUCCESS, { locale, data }),
  failure: error => action(AUTOCOMPLETE.FAILURE, { error }),
}

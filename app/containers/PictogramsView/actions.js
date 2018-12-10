import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAMS = createRequestTypes('PICTOGRAMS')
export const NOT_PUBLISHED_PICTOGRAMS = createRequestTypes('NOT_PUBLISHED_PICTOGRAMS')
export const NOT_VALIDATED_PICTOGRAMS = createRequestTypes('NOT_VALIDATED_PICTOGRAMS')
export const NEW_PICTOGRAMS = createRequestTypes('NEW_PICTOGRAMS')
export const AUTOCOMPLETE = createRequestTypes('AUTOCOMPLETE')
// actions: pictograms.request/success/failure

export const pictograms = {
  request: (locale, searchText) => action(PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(PICTOGRAMS.FAILURE, { error }),
}

export const newPictograms = {
  request: (locale, lastUpdated) => action(NEW_PICTOGRAMS.REQUEST, { locale, lastUpdated }),
  success: (locale, data) => action(NEW_PICTOGRAMS.SUCCESS, { locale, data }),
  failure: error => action(NEW_PICTOGRAMS.FAILURE, { error }),
}

export const autocomplete = {
  request: locale => action(AUTOCOMPLETE.REQUEST, { locale }),
  success: (locale, data) => action(AUTOCOMPLETE.SUCCESS, { locale, data }),
  failure: error => action(AUTOCOMPLETE.FAILURE, { error }),
}

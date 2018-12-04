import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAMS = createRequestTypes('PICTOGRAMS')
export const NOT_PUBLISHED_PICTOGRAMS = createRequestTypes('NOT_PUBLISHED_PICTOGRAMS')
export const NOT_VALIDATED_PICTOGRAMS = createRequestTypes('NOT_VALIDATED_PICTOGRAMS')
export const ALL_PICTOGRAMS = createRequestTypes('ALL_PICTOGRAMS')
export const NEW_PICTOGRAMS = createRequestTypes('NEW_PICTOGRAMS')
export const AUTOCOMPLETE = createRequestTypes('AUTOCOMPLETE')
// actions: pictograms.request/success/failure

export const pictograms = {
  request: (locale, searchText) => action(PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(PICTOGRAMS.FAILURE, { error }),
}

export const notPublishedPictograms = {
  request: (locale, searchText) => action(NOT_PUBLISHED_PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(NOT_PUBLISHED_PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(NOT_PUBLISHED_PICTOGRAMS.FAILURE, { error }),
}

export const notValidatedPictograms = {
  request: (locale, searchText) => action(NOT_VALIDATED_PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(NOT_VALIDATED_PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(NOT_VALIDATED_PICTOGRAMS.FAILURE, { error }),
}

export const newPictograms = {
  request: (locale, searchText) => action(NEW_PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(NEW_PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(NEW_PICTOGRAMS.FAILURE, { error }),
}

export const allPictograms = {
  request: (locale, time) => action(ALL_PICTOGRAMS.REQUEST, { locale, time }),
  success: (locale, data) => action(ALL_PICTOGRAMS.SUCCESS, { locale, data }),
  failure: error => action(ALL_PICTOGRAMS.FAILURE, { error }),
}

export const autocomplete = {
  request: locale => action(AUTOCOMPLETE.REQUEST, { locale }),
  success: (locale, data) => action(AUTOCOMPLETE.SUCCESS, { locale, data }),
  failure: error => action(AUTOCOMPLETE.FAILURE, { error }),
}

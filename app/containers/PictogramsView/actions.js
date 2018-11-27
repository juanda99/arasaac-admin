import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAMS = createRequestTypes('PICTOGRAMS')
export const AUTOCOMPLETE = createRequestTypes('AUTOCOMPLETE')
// actions: pictograms.request/success/failure

export const pictograms = {
  request: (locale, searchText) => action(PICTOGRAMS.REQUEST, { locale, searchText }),
  success: (locale, searchText, data) => action(PICTOGRAMS.SUCCESS, { locale, searchText, data }),
  failure: error => action(PICTOGRAMS.FAILURE, { error }),
}

export const autocomplete = {
  request: locale => action(AUTOCOMPLETE.REQUEST, { locale }),
  success: (locale, data) => action(AUTOCOMPLETE.SUCCESS, { locale, data }),
  failure: error => action(AUTOCOMPLETE.FAILURE, { error }),
}

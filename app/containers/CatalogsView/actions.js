import { createRequestTypes, action } from 'utils/actions'

// constants
export const CATALOGS = createRequestTypes('CATALOGS')
export const GENERATE_CATALOG = createRequestTypes('GENERATE_CATALOG')
export const GENERATE_ALL_CATALOGS = createRequestTypes('GENERATE_ALL_CATALOGS')
// actions: pictograms.request/success/failure

export const catalogs = {
  request: () => action(CATALOGS.REQUEST),
  success: data => action(CATALOGS.SUCCESS, { data }),
  failure: error => action(CATALOGS.FAILURE, { error }),
}

export const generateCatalog = {
  request: locale => action(GENERATE_CATALOG.REQUEST, { locale }),
  success: (locale, data) => action(GENERATE_CATALOG.SUCCESS, { locale, data }),
  failure: error => action(GENERATE_CATALOG.FAILURE, { error }),
}

export const generateAllCatalogs = {
  request: () => action(GENERATE_ALL_CATALOGS.REQUEST),
  success: data => action(GENERATE_ALL_CATALOGS.SUCCESS, { data }),
  failure: error => action(GENERATE_ALL_CATALOGS.FAILURE, { error }),
}

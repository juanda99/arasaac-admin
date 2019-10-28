import { createRequestTypes, action } from 'utils/actions'

export const CATEGORIES = createRequestTypes('CATEGORIES')
export const CATEGORIES_UPDATE = createRequestTypes('CATEGORIES_UPDATE')
export const CATEGORIES_ADD = createRequestTypes('CATEGORIES_ADD')
export const CATEGORIES_DELETE = createRequestTypes('CATEGORIES_DELETE')
export const REMOVE_ERROR = 'REMOVE_ERROR'

export const categories = {
  request: (locale, updated) => action(CATEGORIES.REQUEST, { locale, updated }),
  success: (locale, data) => action(CATEGORIES.SUCCESS, { locale, data }),
  failure: error => action(CATEGORIES.FAILURE, { error }),
}

export const categoriesUpdate = {
  request: (token, locale, item, text, tags, keywords) =>
    action(CATEGORIES_UPDATE.REQUEST, { token, locale, item, text, tags, keywords }),
  success: data => action(CATEGORIES_UPDATE.SUCCESS, { data }),
  failure: error => action(CATEGORIES_UPDATE.FAILURE, { error }),
}

export const categoriesAdd = {
  request: (token, locale, parentItem, data) => action(CATEGORIES_ADD.REQUEST, { token, locale, parentItem, data }),
  success: data => action(CATEGORIES_ADD.SUCCESS, { data }),
  failure: error => action(CATEGORIES_ADD.FAILURE, { error }),
}

export const categoriesDelete = {
  request: (token, locale, item) => action(CATEGORIES_DELETE.REQUEST, { token, locale, item }),
  success: data => action(CATEGORIES_DELETE.SUCCESS, { data }),
  failure: error => action(CATEGORIES_DELETE.FAILURE, { error }),
}

export const removeError = () => action(REMOVE_ERROR)

import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAM = createRequestTypes('PICTOGRAM')
export const PICTOGRAM_UPDATE = createRequestTypes('PICTOGRAM_UPDATE')

// actions: material.request/success/failure
export const pictogram = {
  request: (idPictogram, locale) => action(PICTOGRAM.REQUEST, { idPictogram, locale }),
  success: (locale, data) => action(PICTOGRAM.SUCCESS, { locale, data }),
  failure: error => action(PICTOGRAM.FAILURE, { error }),
}

export const pictogramUpdate = {
  request: (token, userData) => action(PICTOGRAM_UPDATE.REQUEST, { token, userData }),
  success: data => action(PICTOGRAM_UPDATE.SUCCESS, { data }),
  failure: error => action(PICTOGRAM_UPDATE.FAILURE, { error }),
}

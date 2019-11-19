import { createRequestTypes, action } from 'utils/actions'

// constants
export const PICTOGRAM = createRequestTypes('PICTOGRAM')
export const PICTOGRAM_UPDATE = createRequestTypes('PICTOGRAM_UPDATE')
export const REMOVE_ERROR = 'REMOVE_ERROR'

// actions: material.request/success/failure
export const pictogram = {
  request: (idPictogram, locale) => action(PICTOGRAM.REQUEST, { idPictogram, locale }),
  success: (locale, data) => action(PICTOGRAM.SUCCESS, { locale, data }),
  failure: error => action(PICTOGRAM.FAILURE, { error }),
}

export const pictogramUpdate = {
  // eslint-disable-next-line no-shadow
  request: (token, locale, pictogram) =>
    action(PICTOGRAM_UPDATE.REQUEST, {
      token,
      locale,
      pictogram,
    }), // eslint-disable-next-line no-shadow
  success: (locale, data) =>
    action(PICTOGRAM_UPDATE.SUCCESS, {
      locale,
      data,
    }),
  failure: error => action(PICTOGRAM_UPDATE.FAILURE, { error }),
}

export const removeError = () => action(REMOVE_ERROR)

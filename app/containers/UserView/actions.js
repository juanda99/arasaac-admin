import { createRequestTypes, action } from 'utils/actions'

// constants
export const USER = createRequestTypes('USER')
export const USER_UPDATE = createRequestTypes('USER_UPDATE')

export const user = {
  request: (token, id) => action(USER.REQUEST, { token, id }),
  success: data => action(USER.SUCCESS, { data }),
  failure: error => action(USER.FAILURE, { error }),
}

export const userUpdate = {
  request: (token, userData) => action(USER_UPDATE.REQUEST, { token, userData }),
  success: () => action(USER_UPDATE.SUCCESS),
  failure: error => action(USER_UPDATE.FAILURE, { error }),
}

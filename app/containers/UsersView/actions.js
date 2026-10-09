import { createRequestTypes, action } from 'utils/actions'

// constants
export const USERS = createRequestTypes('USERS')

export const users = {
  request: (params, token) => action(USERS.REQUEST, { ...params, token }),
  success: data => action(USERS.SUCCESS, { data }),
  failure: error => action(USERS.FAILURE, { error }),
}

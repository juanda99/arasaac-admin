import { createRequestTypes, action } from 'utils/actions'

// constants
export const USERS = createRequestTypes('USERS')

export const users = {
  request: (updated, token) => action(USERS.REQUEST, { updated, token }),
  success: data => action(USERS.SUCCESS, { data }),
  failure: error => action(USERS.FAILURE, { error }),
}

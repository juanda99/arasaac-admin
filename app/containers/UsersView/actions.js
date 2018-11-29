import { createRequestTypes, action } from 'utils/actions'

// constants
export const USERS = createRequestTypes('USERS')
export const TEMPUSERS = createRequestTypes('TEMPUSERS')

export const users = {
  request: () => action(USERS.REQUEST, {}),
  success: data => action(USERS.SUCCESS, { data }),
  failure: error => action(USERS.FAILURE, { error }),
}

export const tempUsers = {
  request: () => action(TEMPUSERS.REQUEST, {}),
  success: data => action(TEMPUSERS.SUCCESS, { data }),
  failure: error => action(TEMPUSERS.FAILURE, { error }),
}

import { createRequestTypes, action } from 'utils/actions'

// constants
export const USER = createRequestTypes('USER')
export const TEMPUSER = createRequestTypes('TEMPUSER')

export const user = {
  request: () => action(USER.REQUEST, {}),
  success: data => action(USER.SUCCESS, { data }),
  failure: error => action(USER.FAILURE, { error }),
}

export const tempUser = {
  request: () => action(TEMPUSER.REQUEST, {}),
  success: data => action(TEMPUSER.SUCCESS, { data }),
  failure: error => action(TEMPUSER.FAILURE, { error }),
}

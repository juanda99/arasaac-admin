import { createRequestTypes, action } from 'utils/actions'

// constants
export const USER = createRequestTypes('USER')

export const user = {
  request: id => action(USER.REQUEST, { id }),
  success: data => action(USER.SUCCESS, { data }),
  failure: error => action(USER.FAILURE, { error }),
}

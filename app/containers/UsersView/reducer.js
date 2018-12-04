import { Map } from 'immutable'
import { USERS, TEMPUSERS } from './actions'

export const initialState = Map({
  loading: false,
  error: false,
  users: [],
  tempUsers: [],
})

const usersViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS.REQUEST:
      return state.set('loading', true).set('error', false)
    case USERS.SUCCESS:
      return state.set('loading', false).set(
        'users',
        action.payload.data.reduce((obj, item) => {
          // eslint-disable-next-line
          obj[item._id] = item
          return obj
        }, {}),
      )
    case USERS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case TEMPUSERS.REQUEST:
      return state.set('loading', true).set('error', false)
    case TEMPUSERS.SUCCESS:
      return state.setIn('tempUsers', action.payload.data)
    case TEMPUSERS.FAILURE:
      return state.set('error', action.payload.error)
    default:
      return state
  }
}

export default usersViewReducer

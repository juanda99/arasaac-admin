import { fromJS } from 'immutable'
import { USERS, TEMPUSERS } from './actions'

export const initialState = fromJS({
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
      return state.set('loading', false).set('users', action.payload.data)
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

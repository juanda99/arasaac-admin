import { Map } from 'immutable'
import { USER, USER_UPDATE } from './actions'
export const initialState = Map({
  loading: false,
  error: false,
  users: {},
})

const userViewReducer = (state = initialState, action) => {
  let users
  switch (action.type) {
    case USER.REQUEST:
      return state.set('loading', true).set('error', false)
    case USER.SUCCESS:
      users = state.get('users')
      // eslint-disable-next-line no-underscore-dangle
      users[action.payload.data._id] = action.payload.data
      return state.set('loading', false).set('users', users)
    case USER.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case USER_UPDATE.REQUEST:
      return state.set('loading', true).set('error', false)
    case USER_UPDATE.SUCCESS:
      users = state.get('users')
      users[action.payload.data.id] = { ...users[action.payload.data.id], ...action.payload.data.userData }
      return state.set('loading', false).set('users', users)
    case USER_UPDATE.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    default:
      return state
  }
}

export default userViewReducer

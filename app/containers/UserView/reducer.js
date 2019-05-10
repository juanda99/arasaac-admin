import { Map } from 'immutable'
import { USER } from './actions'
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
      console.log(action)
      // eslint-disable-next-line no-underscore-dangle
      users[action.payload.data._id] = action.payload.data
      return state.set('loading', false).set('users', users)
    case USER.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    default:
      return state
  }
}

export default userViewReducer

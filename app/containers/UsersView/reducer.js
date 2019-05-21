/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { Map } from 'immutable'
import { USER, USER_UPDATE } from 'containers/UserView/actions'
import { USERS } from './actions'
export const initialState = Map({
  loading: false,
  error: false,
  updated: '',
  users: {},
})

const usersViewReducer = (state = initialState, action) => {
  let users
  switch (action.type) {
    case USERS.REQUEST:
      return state.set('loading', true).set('error', false)
    case USERS.SUCCESS:
      const actualUsers = state.get('users')
      const newUsers = action.payload.data.reduce((obj, item) => {
        // eslint-disable-next-line no-param-reassign
        obj[item._id] = item
        return obj
      }, {})
      users = { ...actualUsers, ...newUsers }
      return state
        .set('loading', false)
        .set('updated', new Date())
        .set('users', users)
    case USERS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
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
      users[action.payload.data._id] = { ...users[action.payload.data._id], ...action.payload.data }
      return state.set('loading', false).set('users', users)
    case USER_UPDATE.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    default:
      return state
  }
}

export default usersViewReducer

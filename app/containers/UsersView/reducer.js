/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { Map } from 'immutable'
import { USER, USER_UPDATE } from 'containers/UserView/actions'
import { USERS } from './actions'
export const initialState = Map({
  loading: false,
  error: false,
  total: 0,
  users: {},
  usersList: [],
})

const usersViewReducer = (state = initialState, action) => {
  let users
  switch (action.type) {
    case USERS.REQUEST:
      return state.set('loading', true).set('error', false)
    case USERS.SUCCESS:
      const actualUsers = state.get('users')
      const responseData = action.payload.data
      const items = Array.isArray(responseData) ? responseData : (responseData && responseData.data) || []
      const total = responseData && typeof responseData.total === 'number' ? responseData.total : items.length
      const newUsers = items.reduce((obj, item) => {
        // eslint-disable-next-line no-param-reassign
        obj[item._id] = item
        return obj
      }, {})
      users = { ...actualUsers, ...newUsers }
      return state
        .set('loading', false)
        .set('users', users)
        .set('usersList', items)
        .set('total', total)
    case USERS.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case USER.REQUEST:
      return state.set('loading', true).set('error', false)
    case USER.SUCCESS:
      users = { ...state.get('users') }
      // eslint-disable-next-line no-underscore-dangle
      users[action.payload.data._id] = action.payload.data
      return state.set('loading', false).set('users', users)
    case USER.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    case USER_UPDATE.REQUEST:
      return state.set('loading', true).set('error', false)
    case USER_UPDATE.SUCCESS:
      users = { ...state.get('users') }
      users[action.payload.data._id] = { ...users[action.payload.data._id], ...action.payload.data }
      const updatedList = state
        .get('usersList')
        .map(u => (u._id === action.payload.data._id ? { ...u, ...action.payload.data } : u))
      return state
        .set('loading', false)
        .set('users', users)
        .set('usersList', updatedList)
    case USER_UPDATE.FAILURE:
      return state.set('error', action.payload.error).set('loading', false)
    default:
      return state
  }
}

export default usersViewReducer

import { Map } from 'immutable'
import { user, userUpdate } from 'containers/UserView/actions'
import usersViewReducer, { initialState } from '../reducer'
import { users } from '../actions'
import { makeTotalSelector, makeArrayUsersSelector, makeUserByIdSelector } from '../selectors'

describe('usersViewReducer', () => {
  it('returns initial state', () => {
    expect(usersViewReducer(undefined, {})).toEqual(initialState)
  })

  it('handles USERS.REQUEST', () => {
    const state = usersViewReducer(initialState, users.request({ page: 1 }, 'test_token'))
    expect(state.get('loading')).toBe(true)
    expect(state.get('error')).toBe(false)
  })

  it('handles USERS.SUCCESS with paginated response', () => {
    const payload = {
      total: 42,
      data: [{ _id: 'u1', name: 'User 1', email: 'u1@test.com' }, { _id: 'u2', name: 'User 2', email: 'u2@test.com' }],
      page: 1,
      limit: 2,
    }
    const state = usersViewReducer(initialState, users.success(payload))
    expect(state.get('loading')).toBe(false)
    expect(state.get('total')).toBe(42)
    expect(state.get('usersList')).toEqual(payload.data)
    expect(state.get('users').u1).toEqual(payload.data[0])
    expect(state.get('users').u2).toEqual(payload.data[1])
  })

  it('handles USERS.FAILURE', () => {
    const state = usersViewReducer(initialState, users.failure('Network error'))
    expect(state.get('loading')).toBe(false)
    expect(state.get('error')).toBe('Network error')
  })

  it('handles USER.SUCCESS updating single user', () => {
    const state = usersViewReducer(initialState, user.success({ _id: 'u3', name: 'User 3' }))
    expect(state.get('users').u3).toEqual({ _id: 'u3', name: 'User 3' })
  })

  it('handles USER_UPDATE.SUCCESS updating existing user', () => {
    const startState = initialState
      .set('users', { u1: { _id: 'u1', name: 'Old Name' } })
      .set('usersList', [{ _id: 'u1', name: 'Old Name' }])

    const state = usersViewReducer(startState, userUpdate.success({ _id: 'u1', name: 'New Name' }))
    expect(state.get('users').u1.name).toBe('New Name')
    expect(state.get('usersList')[0].name).toBe('New Name')
  })
})

describe('usersView selectors', () => {
  const mockState = Map({
    usersView: Map({
      loading: false,
      total: 50,
      users: {
        u1: { _id: 'u1', name: 'User 1' },
      },
      usersList: [{ _id: 'u1', name: 'User 1' }],
    }),
  })

  it('makeTotalSelector selects total count', () => {
    expect(makeTotalSelector()(mockState)).toBe(50)
  })

  it('makeArrayUsersSelector selects current page users array', () => {
    expect(makeArrayUsersSelector()(mockState)).toEqual([{ _id: 'u1', name: 'User 1' }])
  })

  it('makeUserByIdSelector selects user by id from match params', () => {
    const ownProps = { match: { params: { idUser: 'u1' } } }
    expect(makeUserByIdSelector()(mockState, ownProps)).toEqual({ _id: 'u1', name: 'User 1' })
  })
})

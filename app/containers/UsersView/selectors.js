import { createSelector } from 'reselect'

export const selectUsersViewDomain = state => state.get('usersView')
export const makeLoadingSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('loading'))
export const makeUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('users') || null)
export const makeArrayUsersSelector = () => createSelector(makeUsersSelector(), users => Object.values(users))

export const makeTempUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('tempUsers'))
// TODO remove export
export const makeSelectIdUser = () => (_, ownProps) => ownProps.match.params.idUser
export const makeUserByIdSelector = () =>
  createSelector(
    selectUsersViewDomain,
    makeSelectIdUser(),
    // eslint-disable-next-line no-underscore-dangle
    (substate, idUser) => substate.get('users')[idUser],
  )

const selectAuth = state => state.get('auth')

// we use Token as User
export const makeSelectHasUser = () => createSelector(selectAuth, auth => auth.get('accessToken'))

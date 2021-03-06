import { createSelector } from 'reselect'

export const selectUsersViewDomain = state => state.get('usersView')
export const makeLoadingSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('loading'))
export const makeUpdatedSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('updated'))
export const makeUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('users') || null)
export const makeArrayUsersSelector = () => createSelector(makeUsersSelector(), users => Object.values(users))

// TODO remove export
export const makeSelectIdUser = () => (_, ownProps) => ownProps.match.params.idUser
export const makeUserByIdSelector = () =>
  createSelector(
    makeUsersSelector(),
    makeSelectIdUser(),
    // eslint-disable-next-line no-underscore-dangle
    (substate, idUser) => substate[idUser],
  )

import { createSelector } from 'reselect'

export const selectUsersViewDomain = state => state.get('usersView')
export const makeLoadingSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('loading'))
export const makeTotalSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('total') || 0)
export const makeUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('users') || null)
export const makeArrayUsersSelector = () =>
  createSelector(selectUsersViewDomain, substate => substate.get('usersList') || [])

// TODO remove export
export const makeSelectIdUser = () => (_, ownProps) => ownProps.match.params.idUser
export const makeUserByIdSelector = () =>
  createSelector(
    makeUsersSelector(),
    makeSelectIdUser(),
    // eslint-disable-next-line no-underscore-dangle
    (substate, idUser) => (substate ? substate[idUser] : undefined),
  )

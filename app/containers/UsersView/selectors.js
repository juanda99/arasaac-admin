import { createSelector } from 'reselect'

export const selectUsersViewDomain = state => state.get('usersView')
export const makeLoadingSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('loading'))
export const makeUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('users'))
export const makeTempUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('tempUsers'))

import { createSelector } from 'reselect'

export const selectUsersViewDomain = state => state.get('usersView')
export const makeLoadingSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('loading'))
export const makeUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('users'))
export const makeArrayUsersSelector = () => createSelector(makeUsersSelector(), users => Object.values(users))

export const makeTempUsersSelector = () => createSelector(selectUsersViewDomain, substate => substate.get('tempUsers'))

const makeSelectIdUser = () => (_, ownProps) => ownProps.match.params.idUser
export const makeUserByIdSelector = () => {
  createSelector(
    selectUsersViewDomain,
    makeSelectIdUser(),
    (substate, idUser) =>
      // pictograms.locale does not exists first time, just pictograms
      substate.getIn(['users', idUser]) || new Map(),
  )
}

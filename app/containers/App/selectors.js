import { createSelector } from 'reselect'

const selectRouter = state => state.get('router')

const makeSelectLocation = () => createSelector(selectRouter, routerState => routerState.get('location').toJS())

// makeSelectLocationState expects a plain JS object for the routing state
const makeSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS

  return state => {
    const routingState = state.get('route') // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}

const selectAuth = state => state.get('auth')

// we use Token as User
const makeSelectHasUser = () => createSelector(selectAuth, auth => auth.get('accessToken'))

const makeSelectUserRole = () => createSelector(selectAuth, auth => auth.get('role'))

const makeSelectTargetLanguages = () => createSelector(selectAuth, auth => auth.get('targetLanguages'))

const makeSelectLoading = () => createSelector(selectAuth, auth => auth.get('loading'))

const makeSelectError = () => createSelector(selectAuth, auth => auth.get('error'))

const makeSelectRefreshToken = () => createSelector(selectAuth, auth => auth.get('refreshToken'))

const makeSelectRefreshing = () => createSelector(selectAuth, auth => auth.get('isRefreshing'))

const makeSelectTokens = () =>
  createSelector(makeSelectHasUser(), makeSelectRefreshToken(), (accessToken, refreshToken) => ({
    accessToken,
    refreshToken,
  }))

export {
  makeSelectLocationState,
  selectAuth,
  makeSelectHasUser,
  makeSelectUserRole,
  makeSelectTargetLanguages,
  makeSelectRefreshToken,
  makeSelectTokens,
  makeSelectRefreshing,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
}

import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'

const locationHelper = locationHelperBuilder({})

const userIsAuthenticatedDefaults = {
  authenticatedSelector: state => !!state.getIn(['auth', 'accessToken']),
  wrapperDisplayName: 'UserIsAuthenticated',
}

export const userIsAuthenticated = connectedAuthWrapper(userIsAuthenticatedDefaults)

export const userIsAuthenticatedRedir = connectedRouterRedirect({
  ...userIsAuthenticatedDefaults,
  redirectPath: '/signin',
})

export const userIsAdminRedir = connectedRouterRedirect({
  redirectPath: '/permissionsError',
  allowRedirectBack: false,
  authenticatedSelector: state => state.getIn(['auth', 'role']) === 'admin',
  wrapperDisplayName: 'UserIsAdmin',
})

export const userIsTranslatorRedir = connectedRouterRedirect({
  redirectPath: '/permissionsError',
  allowRedirectBack: false,
  authenticatedSelector: state => state.getIn(['auth', 'role']) === 'translator',
  wrapperDisplayName: 'UserIsTranslator',
})

/* we will control this from sagas */
const userIsNotAuthenticatedDefaults = {
  // Want to redirect the user when they are done loading and authenticated
  authenticatedSelector: state => !state.getIn(['auth', 'accessToken']),
  wrapperDisplayName: 'UserIsNotAuthenticated',
}

export const userIsNotAuthenticated = connectedAuthWrapper(userIsNotAuthenticatedDefaults)

export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
  ...userIsNotAuthenticatedDefaults,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/signin',
  allowRedirectBack: false,
})

export const visibleOnlyAdmin = connectedAuthWrapper({
  authenticatedSelector: state => state.getIn(['auth', 'role']) === 'admin',
  wrapperDisplayName: 'VisibleOnlyAdmin',
})

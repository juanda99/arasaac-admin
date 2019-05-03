/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable'
import { connectRouter } from 'connected-react-router/immutable'
import history from 'utils/history'
import languageProviderReducer from 'containers/LanguageProvider/reducer'
import theme from 'containers/ThemeSelector/reducer'
import { loadingBarReducer } from 'react-redux-loading-bar'
import { reducer as form } from 'redux-form/immutable'
import auth from 'containers/App/reducer'
// import pictogramsViewReducer from 'containers/PictogramsView/reducer'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    language: languageProviderReducer,
    theme,
    loadingBar: loadingBarReducer,
    auth,
    form,
    // pictogramsView: pictogramsViewReducer,
    ...injectedReducers,
  })

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history)
  return mergeWithRouterState(rootReducer)
}

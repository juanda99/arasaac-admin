import { take, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
// import { REHYDRATE } from 'redux-persist/constants'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { USER, user } from './actions'

function* userGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(user.success(response))
  } catch (error) {
    yield put(user.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* userData() {
  const watcher = yield takeLatest(USER.REQUEST, userGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([userData()])
}

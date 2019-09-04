import { take, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { push, LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { logout } from 'containers/App/actions'
import { USERS, users } from './actions'

function* usersGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(users.success(response))
  } catch (error) {
    yield put(users.failure(error.message))
    if (error.message === 'UNAUTHORIZED') {
      yield put(logout())
      yield put(push(encodeURI('/signin?redirect=/users')))
    }
  } finally {
    yield put(hideLoading())
  }
}

export function* usersData() {
  const watcher = yield takeLatest(USERS.REQUEST, usersGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([usersData()])
}

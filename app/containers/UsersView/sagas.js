import { take, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { USERS, users, TEMPUSERS, tempUsers } from './actions'

function* usersGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type])
    yield put(users.success(response))
  } catch (error) {
    yield put(users.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* tempUsersGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type])
    yield put(tempUsers.success(response))
  } catch (error) {
    yield put(tempUsers.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* tempUsersData() {
  const watcher = yield takeLatest(TEMPUSERS.REQUEST, tempUsersGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* usersData() {
  const watcher = yield takeLatest(USERS.REQUEST, usersGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([usersData(), tempUsersData()])
}

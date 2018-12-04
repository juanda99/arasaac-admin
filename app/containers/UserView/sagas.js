import { take, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { USER, user, TEMPUSER, tempUser } from './actions'

function* userGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type])
    yield put(user.success(response))
  } catch (error) {
    yield put(user.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* tempUserGetData(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type])
    yield put(tempUser.success(response))
  } catch (error) {
    yield put(tempUser.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* tempUserData() {
  const watcher = yield takeLatest(TEMPUSER.REQUEST, tempUserGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* userData() {
  const watcher = yield takeLatest(USER.REQUEST, userGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([userData(), tempUserData()])
}

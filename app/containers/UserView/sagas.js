import { take, takeLatest, call, put, cancel, all, select } from 'redux-saga/effects'
import { LOCATION_CHANGE, push } from 'react-router-redux'
// import { REHYDRATE } from 'redux-persist/constants'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { logout } from 'containers/App/actions'
import { makeSelectLocation } from 'containers/App/selectors'
import { USER, user, USER_UPDATE, userUpdate } from './actions'

function* userLoadRequest(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(user.success(response))
  } catch (error) {
    yield put(user.failure(error.message))
    if (error.message === 'UNAUTHORIZED') {
      yield put(logout())
      // get current route
      const { pathname } = yield select(makeSelectLocation())
      yield put(push(encodeURI(`/signin?redirect=${pathname}`)))
    }
  } finally {
    yield put(hideLoading())
  }
}

function* userUpdateRequest(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(userUpdate.success(response))
  } catch (error) {
    yield put(userUpdate.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* userLoadSaga() {
  const watcher = yield takeLatest(USER.REQUEST, userLoadRequest)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* userUpdateSaga() {
  const watcher = yield takeLatest(USER_UPDATE.REQUEST, userUpdateRequest)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([userLoadSaga(), userUpdateSaga()])
}

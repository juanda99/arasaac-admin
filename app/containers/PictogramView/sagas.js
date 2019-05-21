import { take, takeLatest, call, put, cancel, all, select } from 'redux-saga/effects'
import { LOCATION_CHANGE, push } from 'react-router-redux'
// import { REHYDRATE } from 'redux-persist/constants'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { logout } from 'containers/App/actions'
import { makeSelectLocation } from 'containers/App/selectors'
import { PICTOGRAM, pictogram, PICTOGRAM_UPDATE, pictogramUpdate } from './actions'

function* pictogramLoadRequest(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(pictogram.success(response))
  } catch (error) {
    yield put(pictogram.failure(error.message))
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

function* pictogramUpdateRequest(action) {
  try {
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(pictogramUpdate.success(response))
  } catch (error) {
    yield put(pictogramUpdate.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* pictogramLoadSaga() {
  const watcher = yield takeLatest(PICTOGRAM.REQUEST, pictogramLoadRequest)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* pictogramUpdateSaga() {
  const watcher = yield takeLatest(PICTOGRAM_UPDATE.REQUEST, pictogramUpdateRequest)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([pictogramLoadSaga(), pictogramUpdateSaga()])
}

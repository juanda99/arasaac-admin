import { take, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import { CATEGORIES, categories } from 'containers/CategoriesView/actions'
import { PICTOGRAM, pictogram, pictogramUpdate, PICTOGRAM_UPDATE } from './actions'

function* categoriesGetData(action) {
  try {
    const { locale } = action.payload
    // yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(categories.success(locale, response))
  } catch (error) {
    yield put(categories.failure(error.message))
  } finally {
    // yield put(hideLoading())
  }
}

function* pictogramGetData(action) {
  try {
    const { locale } = action.payload
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(pictogram.success(locale, response))
  } catch (error) {
    yield put(pictogram.failure(error.message))
  } finally {
    yield put(hideLoading())
    // When done, we tell Redux we're not in the middle of a request any more
    // yield put({type: SENDING_REQUEST, sending: false})
  }
}

function* pictogramUpdateGetData(action) {
  try {
    const { locale } = action.payload
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(pictogramUpdate.success(locale, response))
  } catch (error) {
    yield put(pictogramUpdate.failure(error.message))
  } finally {
    yield put(hideLoading())
    // When done, we tell Redux we're not in the middle of a request any more
    // yield put({type: SENDING_REQUEST, sending: false})
  }
}

export function* pictogramData() {
  const watcher = yield takeLatest(PICTOGRAM.REQUEST, pictogramGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

export function* pictogramUpdateData() {
  const watcher = yield takeLatest(PICTOGRAM_UPDATE.REQUEST, pictogramUpdateGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

/* also used in CategoriewView */
export function* categoriesData() {
  const watcher = yield takeLatest(CATEGORIES.REQUEST, categoriesGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([pictogramData(), categoriesData(), pictogramUpdateData()])
}

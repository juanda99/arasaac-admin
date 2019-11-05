import { take, call, put, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import api from 'services'
import {
  CATEGORIES,
  CATEGORIES_UPDATE,
  CATEGORIES_ADD,
  CATEGORIES_DELETE,
  categories,
  categoriesUpdate,
  categoriesDelete,
  categoriesAdd,
} from './actions'
import { makeCategoriesSelectorByLanguage } from './selectors'

function* categoriesGetData(action) {
  try {
    const { locale } = action.payload
    yield put(showLoading())
    const response = yield call(api[action.type], action.payload)
    yield put(categories.success(locale, response))
  } catch (error) {
    yield put(categories.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* categoriesAddGetData(action) {
  try {
    const { locale, token, parentItem, data, lastUpdated } = action.payload
    yield put(showLoading())
    const response = yield call(api[action.type], { token, parentItem, data, locale, lastUpdated })
    yield put(categoriesAdd.success(response))
  } catch (error) {
    yield put(categoriesAdd.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* categoriesDeleteGetData(action) {
  try {
    const { token, locale, item, lastUpdated } = action.payload
    yield put(showLoading())
    const response = yield call(api[action.type], { token, locale, item, lastUpdated })
    yield put(categoriesDelete.success(response))
  } catch (error) {
    yield put(categoriesDelete.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* categoriesUpdateGetData(action) {
  try {
    const { token, locale, item, text, tags, keywords, lastUpdated } = action.payload
    yield put(showLoading())
    // should be also in the payload
    // const { lastUpdated } = yield select(makeCategoriesSelectorByLanguage(locale))
    const response = yield call(api[action.type], { token, locale, item, text, tags, keywords, lastUpdated })
    yield put(categoriesUpdate.success(response))
  } catch (error) {
    yield put(categoriesUpdate.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

/* also used in PictogramView/sagas */
export function* categoriesData() {
  const watcher = yield takeLatest(CATEGORIES.REQUEST, categoriesGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  //  yield cancel(watcher)
}

export function* categoriesUpdateData() {
  const watcher = yield takeLatest(CATEGORIES_UPDATE.REQUEST, categoriesUpdateGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

export function* categoriesDeleteData() {
  const watcher = yield takeLatest(CATEGORIES_DELETE.REQUEST, categoriesDeleteGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

export function* categoriesAddData() {
  const watcher = yield takeLatest(CATEGORIES_ADD.REQUEST, categoriesAddGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
}

// All sagas to be loaded
export default function* rootSaga() {
  yield all([categoriesData(), categoriesAddData(), categoriesDeleteData(), categoriesUpdateData()])
}

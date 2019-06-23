import { take, select, takeLatest, call, put, cancel, all } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import jp from 'jsonpath'
import api from 'services'
import { removeKeys } from 'utils'
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
    const { locale, token, parentItem, data } = action.payload
    yield put(showLoading())
    /* we do all the process in the client, send computed categories to the server */
    const allCategories = yield select(makeCategoriesSelectorByLanguage(locale))
    const parentData = jp.value(allCategories, `$..${parentItem}`)
    const key = data.tag
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // removing accents and diacritics
      .replace(/\s/g, '') // without blank spaces
      .toLowerCase()
    const keyExists = jp.value(allCategories, `$..${key}`)
    if (keyExists) throw new Error(`key ${key} already exists in category tree`)
    if (!parentData.children) parentData.children = {}
    parentData.children[key] = data
    jp.value(allCategories, `$..${parentItem}`, parentData)
    const response = yield call(api[action.type], { token, data: allCategories })
    allCategories.lastUpdated = response.lastUpdated
    yield put(categoriesAdd.success(allCategories))
  } catch (error) {
    yield put(categoriesAdd.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* categoriesDeleteGetData(action) {
  try {
    const { token, locale, item } = action.payload
    yield put(showLoading())
    const allCategories = yield select(makeCategoriesSelectorByLanguage(locale))
    removeKeys(allCategories, item)
    const response = yield call(api[action.type], { token, data: allCategories, item })
    allCategories.lastUpdated = response.lastUpdated
    // we should get updatedTime and process it inside reducer
    yield put(categoriesDelete.success(allCategories))
  } catch (error) {
    yield put(categoriesDelete.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

function* categoriesUpdateGetData(action) {
  try {
    const { token, locale, item, data } = action.payload
    yield put(showLoading())
    /* we do all the process in the client, send computed categories to the server */
    const allCategories = yield select(makeCategoriesSelectorByLanguage(locale))
    jp.value(allCategories, `$..${item}`, data)
    const response = yield call(api[action.type], { token, data: allCategories })
    allCategories.lastUpdated = response.lastUpdated
    // we should get updatedTime and process it inside reducer
    yield put(categoriesUpdate.success(allCategories))
  } catch (error) {
    yield put(categoriesUpdate.failure(error.message))
  } finally {
    yield put(hideLoading())
  }
}

export function* categoriesData() {
  const watcher = yield takeLatest(CATEGORIES.REQUEST, categoriesGetData)
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  // yield cancel(watcher)
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

import { searchMaterialSchema, searchPictogramSchema } from './schemas'
import callApi from './callApi'
import {
  login,
  categories, // for update: tag or keywords
  pictogramUpdate,
  categoriesAdd,
  categoriesRemove,
  signup,
  userUpdate,
  socialLogin,
  generateCatalog,
  generateCatalogs,
  uploadPictograms,
  API_ROOT,
  PRIVATE_API_ROOT,
} from './config'

const api = {
  AUTOCOMPLETE_REQUEST: ({ locale }) => callApi(`${API_ROOT}/keywords/${locale}`),
  PICTOGRAMS_REQUEST: ({ locale, searchText }) =>
    callApi(`${API_ROOT}/pictograms/${locale}/search/${searchText}`, {
      schema: searchPictogramSchema,
    }),
  NEW_PICTOGRAMS_REQUEST: ({ locale, updated }) => {
    const url = updated
      ? `${PRIVATE_API_ROOT}/pictograms/${locale}/${updated}`
      : `${PRIVATE_API_ROOT}/pictograms/${locale}`
    return callApi(url, {
      schema: searchPictogramSchema,
    })
  },
  MATERIALS_REQUEST: ({ locale, searchText }) =>
    callApi(`${API_ROOT}/materials/${locale}/${searchText}`, {
      schema: searchMaterialSchema,
    }),
  PICTOGRAM_REQUEST: ({ idPictogram, locale }) => callApi(`${API_ROOT}/pictograms/${locale}/${idPictogram}`),
  // token in options, because is not application/json
  PICTOGRAMS_UPLOAD_REQUEST: (files, token) => callApi(uploadPictograms.url, uploadPictograms.options(files, token)),
  PICTOGRAM_TYPE_REQUEST: idPictogram => callApi(`${PRIVATE_API_ROOT}/pictograms/types/${idPictogram}`),
  PICTOGRAM_KEYWORDS_REQUEST: ({ keywordsHintLocale, idPictogram }) =>
    callApi(`${PRIVATE_API_ROOT}/pictograms/keywords/${keywordsHintLocale}/${idPictogram}`),
  PICTOGRAM_UPDATE_REQUEST: ({ token, locale, pictogram }) =>
    callApi(pictogramUpdate.url, pictogramUpdate.options(locale, pictogram), token),
  LOGIN_REQUEST: ({ username, password }) => callApi(login.url, login.options(username, password)),
  SOCIAL_LOGIN_REQUEST: ({ socialToken, provider, locale }) =>
    callApi(socialLogin.url, socialLogin.options(socialToken, provider, locale)),
  SIGNUP_REQUEST: userData => callApi(signup.url, signup.options(userData)),
  USERS_REQUEST: ({ updated, token }) => callApi(`${PRIVATE_API_ROOT}/users/date/${updated}`, null, token),
  USER_REQUEST: ({ token, id }) => callApi(`${PRIVATE_API_ROOT}/users/${id}`, null, token),
  USER_UPDATE_REQUEST: ({ token, userData }) => callApi(userUpdate.url(userData), userUpdate.options(userData), token),
  CATALOGS_REQUEST: () => callApi(`${PRIVATE_API_ROOT}/catalogs`),
  GENERATE_CATALOG: ({ language }) => callApi(generateCatalog.url(language), generateCatalog.options()),
  GENERATE_CATALOGS: () => callApi(generateCatalogs.url, generateCatalogs.options()),
  CATEGORIES_REQUEST: ({ locale, updated }) => callApi(`${PRIVATE_API_ROOT}/categories/${locale}/${updated}`),
  CATEGORIES_UPDATE_REQUEST: ({ token, locale, item, text, tags, keywords, lastUpdated }) =>
    callApi(categories.url, categories.options(locale, item, text, tags, keywords, lastUpdated), token),
  // import, same as update
  CATEGORIES_IMPORT_REQUEST: ({ token, data }) => callApi(categories.url, categories.options(data), token),
  CATEGORIES_ADD_REQUEST: ({ token, parentItem, data, locale, lastUpdated }) =>
    callApi(categoriesAdd.url, categoriesAdd.options(parentItem, data, locale, lastUpdated), token),
  CATEGORIES_DELETE_REQUEST: ({ token, locale, item, lastUpdated }) =>
    callApi(categoriesRemove.url, categoriesRemove.options(locale, item, lastUpdated), token),
}

export default api

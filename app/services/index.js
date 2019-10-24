import { searchMaterialSchema, searchPictogramSchema } from './schemas'
import callApi from './callApi'
import {
  login,
  categories, // for update: tag or keywords
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
  NEW_PICTOGRAMS_REQUEST: ({ locale, lastUpdated }) => {
    const url = lastUpdated
      ? `${PRIVATE_API_ROOT}/pictograms/${locale}/${lastUpdated}`
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
  PICTOGRAMS_UPLOAD_REQUEST: files => callApi(uploadPictograms.url, uploadPictograms.options(files)),
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
  CATEGORIES_UPDATE_REQUEST: ({ token, data }) => callApi(categories.url, categories.options(data), token),
  // import, same as update
  CATEGORIES_IMPORT_REQUEST: ({ token, data }) => callApi(categories.url, categories.options(data), token),
  CATEGORIES_ADD_REQUEST: ({ token, data }) => callApi(categoriesAdd.url, categoriesAdd.options(data), token),
  CATEGORIES_DELETE_REQUEST: ({ token, data, item }) =>
    callApi(categoriesRemove.url, categoriesRemove.options(data, item), token),
}

export default api

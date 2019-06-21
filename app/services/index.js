import { searchMaterialSchema, searchPictogramSchema } from './schemas'
import callApi from './callApi'
import {
  login,
  categories,
  signup,
  userUpdate,
  socialLogin,
  generateCatalog,
  generateCatalogs,
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
  LOGIN_REQUEST: ({ username, password }) => callApi(login.url, login.options(username, password)),
  SOCIAL_LOGIN_REQUEST: ({ socialToken, provider }) =>
    callApi(socialLogin.url, socialLogin.options(socialToken, provider)),
  SIGNUP_REQUEST: userData => callApi(signup.url, signup.options(userData)),
  USERS_REQUEST: ({ updated, token }) => callApi(`${PRIVATE_API_ROOT}/users/date/${updated}`, null, token),
  USER_REQUEST: ({ token, id }) => callApi(`${PRIVATE_API_ROOT}/users/${id}`, null, token),
  USER_UPDATE_REQUEST: ({ token, userData }) => callApi(userUpdate.url(userData), userUpdate.options(userData), token),
  CATALOGS_REQUEST: () => callApi(`${PRIVATE_API_ROOT}/catalogs`),
  GENERATE_CATALOG: ({ language }) => callApi(generateCatalog.url(language), generateCatalog.options()),
  GENERATE_CATALOGS: () => callApi(generateCatalogs.url, generateCatalogs.options()),
  CATEGORIES_REQUEST: ({ locale, updated }) => callApi(`${PRIVATE_API_ROOT}/categories/${locale}/${updated}`),
  CATEGORIES_UPDATE_REQUEST: ({ token, data }) => callApi(categories.url, categories.options(data), token),
}

export default api

/*
  signIn,
  signUp,
  sendVerificationEmail,
  emailVerification
*/

import { CHANGE_THEME, DEFAULT_THEME } from './constants'

export const initialState = DEFAULT_THEME

export const ThemeSelectorReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return action.theme
    default:
      return state
  }
}

export default ThemeSelectorReducer

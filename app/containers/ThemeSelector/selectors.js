import { initialState } from './reducer'
const selectTheme = state => state.get('theme', initialState)
export { selectTheme }

// import deburr from 'lodash/deburr'
import removeDiacritics from './removeDiacritics'

// const LIST_ITEMS = 10

export const getSuggestions = (value, dataSource) => {
  // const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = value.length
  // const count = 0
  if (inputLength === 0) return []
  return dataSource.filter(
    key =>
      removeDiacritics(key)
        .toLowerCase()
        .indexOf(removeDiacritics(value).toLowerCase()) !== -1,
  )
  /*  const keep = count < LIST_ITEMS && suggestion.slice(0, inputLength).toLowerCase() === inputValue
    if (keep) count += 1
    return suggestion
  */
}

export default getSuggestions

import deburr from 'lodash/deburr'

const LIST_ITEMS = 10

export const getSuggestions = (value, dataSource) => {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = value.length
  let count = 0
  if (inputLength === 0) return []
  return dataSource.filter(suggestion => {
    const keep = count < LIST_ITEMS && suggestion.slice(0, inputLength).toLowerCase() === inputValue
    if (keep) count += 1
    return suggestion
  })
}

export default getSuggestions

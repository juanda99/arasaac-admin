function isArray(obj) {
  return !!obj && obj.constructor === Array
}

const checkLanguage = (item, language) =>
  language.size === 0 ||
  language.includes(item.language) ||
  (item.translations && item.translations.some(translation => language.includes(translation.language)))

export const getFilteredItems = (items, filters) =>
  items.filter(item => {
    const [...filterNames] = filters.keys()
    return filterNames.every(filterName => {
      if (filterName === 'language') {
        return checkLanguage(item, filters.get('language'))
      }
      if (filters.get(filterName).size === 0 || filters.get(filterName) === '') {
        return true
      }
      if (typeof item[filterName] === 'string' || typeof item[filterName] === 'number') {
        return item[filterName] === filters.get(filterName) || filters.get(filterName).includes(item[filterName])
      }
      if (isArray(item[filterName]) && item[filterName].length) {
        return item[filterName].some(keyItems => filters.get(filterName).includes(keyItems))
      }
      return false
    })
  })

/* inside pictograms, check which keywords meets an specific searchText */
export const keywordSelector = (searchText, keywords) => {
  const searchTextArray = searchText ? searchText.split(' ') : []
  if (!searchTextArray.length) {
    return keywords[0] || ''
  }
  return (
    keywords.find(keywordsItem => {
      const keywordArray = keywordsItem.keyword.split(' ')
      const found = searchTextArray.some(word => keywordArray.includes(word))
      return found
    }) ||
    keywords[0] ||
    ''
  ) /* in case find doesn't get any results, we get first one */
}

export const getQueryStringValue = key =>
  decodeURIComponent(
    window.location.search.replace(
      new RegExp(`^(?:.*[&\\?]${encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`, 'i'),
      '$1',
    ),
  )

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
export const removeKeys = (obj, keys) => {
  let index
  for (const prop in obj) {
    // important check that this is objects own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          }
          break
        case 'object':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          } else {
            removeKeys(obj[prop], keys)
          }
          break
      }
    }
  }
}

export const languages = [
  {
    code: 'ca',
    text: 'Català',
  },
  {
    code: 'de',
    text: 'Deutsche',
  },
  {
    code: 'es',
    text: 'Español',
  },
  {
    code: 'en',
    text: 'English',
  },
  {
    code: 'eu',
    text: 'Euskal',
  },
  {
    code: 'fr',
    text: 'Français',
  },
  {
    code: 'gl',
    text: 'Galego',
  },
  {
    code: 'cr',
    text: 'Hrvatski',
  },
  {
    code: 'it',
    text: 'Italiano',
  },
  {
    code: 'bg',
    text: 'български',
  },
  {
    code: 'pl',
    text: 'Polskie',
  },
  {
    code: 'pt',
    text: 'Português',
  },
  {
    code: 'br',
    text: 'Português do Brasil',
  },
  {
    code: 'ro',
    text: 'Română',
  },
  {
    code: 'ru',
    text: 'Pусский',
  },
  {
    code: 'val',
    text: 'Valencia',
  },
  {
    code: 'ar',
    text: 'عربى',
  },
  {
    code: 'zh',
    text: '简体中文）',
  },
]

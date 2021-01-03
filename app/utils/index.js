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
  const emptyResponse = { keyword: '' }
  if (keywords.length === 0) return emptyResponse
  const searchTextArray = searchText ? searchText.split(' ') : []
  if (!searchTextArray.length) return keywords[0]
  // if same keyword exists, return it
  let keyword = keywords.find(
    (keywordsItem) => keywordsItem.keyword && keywordsItem.keyword.toLowerCase() === searchText.toLowerCase(),
  )
  if (keyword) return keyword

  // otherwise, return first partial match or fist keyword if no matches
  keyword =  keywords.find((keywordsItem) => {
    if (!keywordsItem.keyword) return false
    const keywordArray = keywordsItem.keyword.split(' ').map((keyword) => keyword.toLowerCase())
    return searchTextArray.some((word) => keywordArray.includes(word.toLowerCase()))
  }) 
  if  (keyword) return keyword

  const regexp = new RegExp(searchText, "i")
  keyword = keywords.find((keywordsItem) => {
    if (!keywordsItem.keyword) return false
    //  use regex for phonemen
    return regexp.test(keywordsItem.keyword)
  })
  if (keyword) return keyword
  return keywords[0] ||emptyResponse
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
    code: 'es',
    text: 'Español'
  },
  {
    code: 'en',
    text: 'English'
  },
  {
    code: 'ar',
    text: 'عربى'
  },
  {
    code: 'an',
    text: 'Aragonés'
  },
  {
    code: 'bg',
    text: 'български'
  },
  {
    code: 'br',
    text: 'Português do Brasil'
  },
  {
    code: 'ca',
    text: 'Català'
  },
  {
    code: 'de',
    text: 'Deutsche'
  },
  {
    code: 'et',
    text: 'Eestlane'
  },
  {
    code: 'eu',
    text: 'Euskal'
  },
  {
    code: 'fa',
    text: 'فارسی'
  },
  {
    code: 'fr',
    text: 'Français'
  },
  {
    code: 'gl',
    text: 'Galego'
  },
  {
    code: 'he',
    text: 'עברי' // hebreo
  },
  {
    code: 'hr',
    text: 'Hrvatski'
  },
  {
    code: 'hu',
    text: 'Magyar'
  },
  {
    code: 'it',
    text: 'Italiano'
  },
  {
    code: 'mk',
    text: 'Македонски'
  },
  {
    code: 'el',
    text: 'Ελληνικά'
  },
  {
    code: 'nl',
    text: 'Nederlands'
  },
  {
    code: 'pl',
    text: 'Polski'
  },
  {
    code: 'pt',
    text: 'Português'
  },
  {
    code: 'ro',
    text: 'Română'
  },
  {
    code: 'ru',
    text: 'Pусский'
  },
  {
    code: 'sk',
    text: 'Slovenský'
  },
  {
    code: 'sq',
    text: 'Shqip'
  },
  {
    code: 'sv',
    text: 'Svenska'
  },
  {
    code: 'sr',
    text: 'Српски'
  },
  {
    code: 'val',
    text: 'Valencia'
  },
  {
    code: 'zh',
    text: '简体中文）'
  }
]

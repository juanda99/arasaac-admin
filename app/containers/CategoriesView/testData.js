/*
  db.getCollection('categories').insertMany(
    [
  { locale: 'es',
    lastUpdated: ISODate("2019-09-09T01:11:18.965Z"),
    data: {
        panaderia: {
          tag: 'Panadería',
          children: {
            pan: {
              tag: 'Tipos de pan',
              keywords: ['Tipos de pan', 'Barras de pan'],
              children: {
                hogaza: { tag: 'Hogaza', keywords: ['Pan de hogaza', 'Pan de pueblo'] },
                baguette: { tag: 'Baguette', keywords: ['Pan de baguette', 'Baguette'] }
              }
            },
            leche: { tag: 'Leche', keywords: ['Leche'] },
            magdalenas: { tag: 'Magdalenas', keywords: ['Magdalenas', 'Madalenas'] }
          }
        }
    }
  },
  { locale: 'en',
    lastUpdated: ISODate("2019-09-09T01:11:18.965Z"),
    data: {
        panaderia: {
          tag: 'Backery',
          children: {
            pan: {
              tag: 'Breads',
              keywords: ['Bread type'],
              children: {
                hogaza: { tag: 'Bread loaf', keywords: ['Bread Loaf', 'Village bread'] },
                baguette: { tag: 'Baguette', keywords: ['Baguette'] }
              }
            },
            leche: { tag: 'Milk', keywords: ['Milk'] },
            muffins: { tag: 'Muffins', keywords: ['Muffins'] }
          }
        }
    }
  }
  ]
  )
*/

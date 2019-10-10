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
            magdalenas: { tag: 'Muffins', keywords: ['Muffins'] }
          }
        }
    }
  }
  ]
  )
*/

/* change nested object to array of objects for antd treeselect:

var objectToArray = (obj) => Object.keys(obj).map(function(k) { 
  obj[k].key = k;
  if (obj[k].children) obj[k].children = objectToArray(obj[k].children)
  return obj[k] 
});
*/

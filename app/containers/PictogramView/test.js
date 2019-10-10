const data = {
  panaderia: {
    tag: 'Panadería',
    children: {
      pan: {
        tag: 'Tipos de pan',
        keywords: ['Tipos de pan', 'Barras de pan'],
        children: {
          hogaza: {
            tag: 'Hogaza',
            keywords: ['Pan de hogaza', 'Pan de pueblo'],
          },
          baguette: {
            tag: 'Baguette',
            keywords: ['Pan de baguette', 'Baguette'],
          },
        },
      },
      leche: { tag: 'Leche', keywords: ['Leche'] },
      magdalenas: { tag: 'Magdalenas', keywords: ['Magdalenas', 'Madalenas'] },
    },
  },
  pasteleria: {
    tag: 'Pastelería',
    children: {
      pastel: {
        tag: 'Tipos de pastel',
        keywords: ['Tipos de pastel', 'Tartas heladas'],
        children: {
          tartas: {
            tag: 'Tartas',
            keywords: ['Tarta'],
          },
          roscones: {
            tag: 'Roscones',
            keywords: ['Roscón de San Valero', 'Roscón', 'Roscones'],
          },
        },
      },
    },
  },
}
export default data

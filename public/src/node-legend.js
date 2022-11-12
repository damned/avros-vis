/* globals AFRAME THREE au */
AFRAME.registerComponent('node-legend', {
  schema: {
    title: { type: 'string', default: 'node types' }
  },
  init: function () {
    const self = this
    const el = self.el
    const nodeSystem = el.sceneEl.systems.node;

    const addLegendTypeRow = (type, x, y) => {
      const typeAttributes = nodeSystem.typesToAttributes[type]
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-entity', {
        geometry: au.attributeValue(typeAttributes.geometry),
        material: au.attributeValue(typeAttributes.material),
        scale: '0.5 0.5 0.5',
        position: `${x - 0.1} ${y} 0`
      }))
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-text', {
        'value': type === nodeSystem.DEFAULT_TYPE ? 'other' : type,
        position: `${x + 0.06} ${y} 0`,
        scale: '0.2 0.2 0.2'
      }))
    }

    el.setAttribute('text', au.attributeValue({
      value: self.data.title,
      align: 'center',
      baseline: 'top'
    }))

    const spacingX = 0.5
    const spacingY = 0.1
    const offsetY = -0.15
    const columnSize = 3
    Object.keys(nodeSystem.typesToAttributes).forEach((type, i) => {
      let column = Math.floor(i / columnSize)
      let row = i % columnSize
      addLegendTypeRow(type, spacingX * column, offsetY - (spacingY * row));
    })
  }
})

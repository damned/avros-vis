/* globals AFRAME THREE au */
AFRAME.registerComponent('node-legend', {
  schema: {
    title: { type: 'string', default: 'node types' }
  },
  init: function () {
    const self = this
    const el = self.el
    const nodeSystem = el.sceneEl.systems.node;

    const addLegendTypeRow = (type, y) => {
      const typeAttributes = nodeSystem.typesToAttributes[type]
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-entity', {
        geometry: au.attributeValue(typeAttributes.geometry),
        material: au.attributeValue(typeAttributes.material),
        scale: '0.5 0.5 0.5',
        position: `-0.1 ${y} 0`
      }))
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-text', {
        'value': type === nodeSystem.DEFAULT_TYPE ? 'other' : type,
        position: `0.06 ${y} 0`,
        scale: '0.2 0.2 0.2'
      }))
    }

    el.setAttribute('text', au.attributeValue({
      value: self.data.title,
      align: 'center',
      baseline: 'top'
    }))

    const spacingY = 0.1
    Object.keys(nodeSystem.typesToAttributes).forEach((type, i) => {
      addLegendTypeRow(type, -0.15 - (spacingY * i));
    })
  }
})

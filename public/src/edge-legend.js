/* globals AFRAME THREE au */
AFRAME.registerComponent('edge-legend', {
  schema: {
    title: { type: 'string', default: 'edge types' }
  },
  init: function () {
    const self = this
    const el = self.el
    const edgeSystem = el.sceneEl.systems.edge;

    const addLegendTypeRow = (type, y) => {
      let startClass = type + '-legend-start';
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-entity', {
        'class': startClass,
        position: `-0.2 ${y} 0`
      }))
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-entity', {
        'edge': au.attributeValue({
          from: '.' + startClass,
          type
        }),
        position: `0 ${y} 0`
      }))
      el.insertAdjacentHTML('beforeend', au.entityHtml('a-text', {
        'value': type === edgeSystem.DEFAULT_TYPE ? 'other' : type,
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
    Object.keys(edgeSystem.typesToAttributes).forEach((type, i) => {
      addLegendTypeRow(type, -0.15 - (spacingY * i));
    })
  }
})

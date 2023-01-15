/* globals AFRAME THREE au */
AFRAME.registerComponent('tablet', {
  schema: {
    text: { type: 'string' }
  },
  init: function () {
    const self = this
    const el = self.el

    const tabletGeometry = new RoundedBoxGeometry(1, 0.4, 0.1, 3);
    const tabletMaterial = new THREE.MeshPhongMaterial({ color: '#333' });
    const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
    el.object3D.add(tablet)

    au.entity(el, 'a-text', {
      align: 'center',
      position: '0 0 0.051',
      value: self.data.text,
      width: 0.9,
      'wrap-count': 30
    })
  }
})

/* globals AFRAME THREE au */
AFRAME.registerComponent('balloon-label', {
  schema: {
    label: { type: 'string' },
    color: { type: 'color', default: '#888' },
    scale: { type: 'number', default: 0.5 },
    yOffset: { type: 'number', default: 0 }
  },
  init: function () {
    const self = this
    let hostPos = self.el.object3D.position
    let lastHostPos = new THREE.Vector3()
    lastHostPos.copy(hostPos)
    let parent = self.el.parentNode
    console.log('labelling element at: ' + JSON.stringify(hostPos))
    
    
    let calcLabelPos = (hostPos) => ({
      x: hostPos.x,
      y: hostPos.y + 0.5 + self.data.yOffset,
      z: hostPos.z
    })
    
    let labelPosSpec = au.xyzTriplet(calcLabelPos(hostPos))
    let text = au.entity(parent, 'a-text', {
      align: 'center',
      color: self.data.color,
      position: labelPosSpec,
      scale: `${self.data.scale} ${self.data.scale}`,
      value: self.data.label
    })
    
    let line = au.entity(parent, 'a-entity', { 
      line: {
        opacity: 0.3,
        start: labelPosSpec,
        end: au.xyzTriplet(hostPos)
      }
    })

    let updateLabelPos = (newHostPos) => {
      let newLabelPos = calcLabelPos(newHostPos)
      text.object3D.position.set(newLabelPos.x, newLabelPos.y, newLabelPos.z)
      line.setAttribute('line', 'start', newLabelPos)
      line.setAttribute('line', 'end', au.xyzTriplet(newHostPos))
      self.el.emit('balloonlabel.moved', { description: 'Entity has moved to ' + newHostPos})
    }
    
    
    self.tick = AFRAME.utils.throttleTick(() => {
      let newHostPos = self.el.object3D.position
      if (!lastHostPos.equals(newHostPos)) {
        updateLabelPos(newHostPos)
        lastHostPos.copy(newHostPos)
      }
    }, 100)
  }
})

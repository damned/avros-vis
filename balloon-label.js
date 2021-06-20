/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('balloon-label', {
  schema: {
    label: { type: "string" },
    scale: { type: "number", default: 0.5 },
    yOffset: { type: "number", default: 0 }
  },
  init: function () {
    const au = aframeUtils
    let hostPos = this.el.object3D.position
    let lastHostPos = new THREE.Vector3()
    hostPos.copy(lastHostPos)
    let parent = this.el.parentNode
    console.log('labelling element at: ' + JSON.stringify(hostPos))
    
    
    let calcLabelPos = (hostPos) => ({
      x: hostPos.x,
      y: hostPos.y + 0.5 + this.data.yOffset,
      z: hostPos.z
    })
    
    let text = document.createElement('a-text')
    let hostPosSpec = au.xyzTriplet(calcLabelPos(hostPos))
    text.setAttribute('align', 'center')
    text.setAttribute('value', this.data.label)
    text.setAttribute('color', '#888')
    text.setAttribute('scale', `${this.data.scale} ${this.data.scale}`)
    text.setAttribute('position', hostPosSpec)
    parent.appendChild(text)
    
    let line = document.createElement('a-entity')
    line.setAttribute('line', `opacity: 0.3; start: ${hostPosSpec}; end: ${au.xyzTriplet(hostPos)}`)
    parent.appendChild(line)
    
    this.tick = () => {
      let newHostPos = this.el.object3D.position
      if (!lastHostPos.equals(newHostPos)) {
        this.el.emit('balloonlabel.moved', { description: 'Entity has moved to ' + newHostPos })
        newHostPos.copy(lastHostPos)
      }
    }
  }
})

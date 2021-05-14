/* globals AFRAME */
AFRAME.registerComponent('balloon-label', {
  schema: {
    label: { type: "string" },
    scale: { type: "number", default: 0.5 },
    yOffset: { type: "number", default: 0 }
  },
  init: function () {
    let pos = this.el.object3D.position
    let parent = this.el.parentNode
    console.log('labelling element at: ' + JSON.stringify(pos))
    
    
    let labelY = pos.y + 0.5 + this.data.yOffset
    
    let text = document.createElement('a-text')
    text.setAttribute('align', 'center')
    text.setAttribute('value', this.data.label)
    text.setAttribute('color', '#888')
    text.setAttribute('scale', `${this.data.scale} ${this.data.scale}`)
    text.setAttribute('position', `${pos.x} ${labelY} ${pos.z}`)
    parent.appendChild(text)
    
    let line = document.createElement('a-entity')
    line.setAttribute('line', `opacity: 0.3; start: ${pos.x} ${labelY} ${pos.z}; end: ${pos.x} ${pos.y} ${pos.z}`)
    parent.appendChild(line)
  }
})

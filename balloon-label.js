/* globals AFRAME */
AFRAME.registerComponent('balloon-label', {
  schema: {
    label: { type: "string" },
  },
  init: function () {
    let pos = this.el.object3D.position
    let parent = this.el.parentNode
    console.log('labelling element at: ' + JSON.stringify(pos))
    
    let text = document.createElement('a-text')
    text.setAttribute('align', 'center')
    text.setAttribute('value', this.data.label)
    text.setAttribute('color', '#888')
    text.setAttribute('scale', '0.5 0.5')
    text.setAttribute('position', `${pos.x} ${pos.y + 0.5} ${pos.z}`)
    parent.appendChild(text)
    
    let line = document.createElement('a-entity')
    line.setAttribute('line', `opacity: 0.3; start: ${pos.x} ${pos.y + 0.5} ${pos.z}; end: ${pos.x} ${pos.y} ${pos.z}`)
    parent.appendChild(line)
  }
})

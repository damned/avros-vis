/* globals AFRAME */
AFRAME.registerComponent('balloon-label', {
  init: function () {
    let pos = this.el.object3D.position
    let parent = this.el.object3D.parent.el
    console.log('labelling element at: ' + JSON.stringify(pos))
    
    let text = document.createElement('a-text')
    text.setAttribute('align', 'center')
    text.setAttribute('value', this.data)
    text.setAttribute('color', '#888')
    text.setAttribute('scale')
    text.setAttribute('position', `${pos.x} ${pos.y + 0.5} ${pos.z}`)
    parent.appendChild(text)
    
    let line = document.createElement('a-entity')
    line.setAttribute('line', `start: ${pos.x} ${pos.y + 0.5} ${pos.z}; end: ${pos.x} ${pos.y} ${pos.z}`)
    parent.appendChild(line)
  }
})

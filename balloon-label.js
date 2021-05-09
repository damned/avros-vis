/* globals AFRAME */
AFRAME.registerComponent('balloon-label', {
  init: function () {
    console.log('what the heck')
    let text = document.createElement('a-text')
    text.setAttribute('value', this.data)
    text.setAttribute('position', '0 1 0')
    this.el.appendChild(text)
  }
})

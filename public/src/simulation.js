/* globals AFRAME au */
AFRAME.registerComponent('simulation', {
  init: function () {
    const self = this
    const el = self.el
    const initSimEventAnimation = () => {
      const firstNode = el.querySelector('.node')
      const nextNode = node => node.components.edge.data.to

      let next = nextNode(firstNode)

      const simEvent = au.addEntityTo(el, 'a-sphere', {
        position: au.xyzTriplet(firstNode.getAttribute('position')),
        radius: 0.03,
        color: 'white'
      })
      const transitTime = 1000
      const startNextTransit = () => {
        simEvent.setAttribute('animation', au.attributeValue({
          property: 'position',
          to: au.xyzTriplet(next.getAttribute('position')),
          dur: transitTime,
          easing: 'easeInOutQuad'
        }))
        next = nextNode(next)
      }
      startNextTransit()
      setInterval(startNextTransit, 1.2 * transitTime)
    }
    setTimeout(initSimEventAnimation, 1000)
  }
})

/* globals AFRAME au */
AFRAME.registerComponent('simulation', {
  init: function () {
    const DELAY_BETWEEN_SIMULATIONS_MS = 2000;
    const EDGE_TRANSIT_TIME_MS = 1500

    const self = this
    const el = self.el

    const initSimEventAnimation = () => {
      const scenario = el.querySelector("[data-node-type='scenario']")
      console.log('got scenario', scenario)
      const firstNodeSelector = '#' + scenario.dataset.startsWith;
      console.log('got first node selector', firstNodeSelector)
      const firstNode = el.querySelector(firstNodeSelector)
      console.log('got first node', firstNode)
      const nextNode = node => {
        const edge = node.components.edge
        if (edge) {
          return edge.data.to;
        }
        return null
      }

      let next = nextNode(firstNode)

      const simEvent = au.addEntityTo(el, 'a-sphere', {
        position: au.xyzTriplet(firstNode.getAttribute('position')),
        radius: 0.03,
        color: 'white'
      })
      const startNextTransit = () => {
        simEvent.setAttribute('animation', au.attributeValue({
          property: 'position',
          to: au.xyzTriplet(next.getAttribute('position')),
          dur: EDGE_TRANSIT_TIME_MS,
          easing: 'easeInOutQuad'
        }))
        next = nextNode(next)
        if (next) {
          setTimeout(startNextTransit, 1.2 * EDGE_TRANSIT_TIME_MS)
        }
        else {
          setTimeout(() => {
            simEvent.remove()
            initSimEventAnimation()
          }, DELAY_BETWEEN_SIMULATIONS_MS)
        }
      }
      startNextTransit()
    }
    setTimeout(initSimEventAnimation, DELAY_BETWEEN_SIMULATIONS_MS)
  }
})

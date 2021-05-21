/* globals AFRAME aframeUtils */
AFRAME.registerComponent('placement', {
  schema: {
    on: { type: "selector" }
  },
  init: function () {
    let self = this
    let host = self.el
    
    self.update = () => {
      let au = aframeUtils
      let on = self.data.on
      
      let pos = host.object3D.position
      
      pos.y = au.top(host) + au.height(self) / 2
      
      host.setAttribute(au.xyzTriplet(pos))
      
      console.log('placement set to ', pos)
    }
  }
})

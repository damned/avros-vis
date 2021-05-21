/* globals AFRAME THREE aframeUtils */
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
      
      let onPos = on.object3D.position
      console.log('host is loaded: ', host.hasLoaded)
      console.log('on is loaded: ', on.hasLoaded)

      console.log('on pos: ', JSON.stringify(onPos))
      
      
      let onSize = new THREE.Box3().setFromObject(on)
      let hostSize = new THREE.Box3().setFromObject(host)
      
      let pos = onPos.clone()
      pos.y = onPos.y + (onSize.y / 2) + (hostSize.y / 2)
      
      host.setAttribute(au.xyzTriplet(pos))
      
      console.log('placement set to ', pos)
    }
  }
})

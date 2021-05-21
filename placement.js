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
      let placed = false
      
      let placeOn = () => {
        console.log('placeOn: host is loaded: ', host.hasLoaded)
        console.log('placeOn: on is loaded: ', on.hasLoaded)

        let onPos = on.object3D.position
        console.log('on pos: ', JSON.stringify(onPos))

        let onSize = new THREE.Box3().setFromObject(on)
        let hostSize = new THREE.Box3().setFromObject(host)

        console.log('on size: ', JSON.stringify(onSize))
        console.log('host size: ', JSON.stringify(hostSize))

        let pos = onPos.clone()
        pos.y = onPos.y + (onSize.y / 2) + (hostSize.y / 2)

        host.setAttribute(au.xyzTriplet(pos))

        console.log('placement set to ', pos)
        
      }
      
      
      console.log('update: host is loaded: ', host.hasLoaded)
      console.log('update: on is loaded: ', on.hasLoaded)

      on.addEventListener('loaded', placeOn)
    }
  }
})

/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('placement', {
  schema: {
    on: { type: "selector" }
  },
  init: function () {
    let self = this
    let host = self.el
    let au = aframeUtils
    
    self.update = () => {
      let on = self.data.on
      let justPlaced = false
      let emitPlacedNext = false
      
      let placeOn = () => {
        au.catching(() => {
          
          console.log('placeOn: host is loaded: ', host.hasLoaded)
          console.log('placeOn: on is loaded: ', on.hasLoaded)

          let on3d = on.object3D
          let onPos = on.object3D.position
          let host3d = host.object3D
          console.log('on pos: ', JSON.stringify(onPos))

          let box = new THREE.Box3()
          let onSize = box.setFromObject(on3d).getSize(new THREE.Vector3())
          let hostSize = box.setFromObject(host3d).getSize(new THREE.Vector3())

          console.log('on size: ', JSON.stringify(onSize))
          console.log('host size: ', JSON.stringify(hostSize))

          let pos = onPos.clone()
          console.log('on pos y', onPos.y)
          console.log('on size y', onSize.y)
          let newY = onPos.y + (onSize.y / 2) + (hostSize.y / 2)
          console.log('newY', newY)
          pos.setY(newY)

          console.log('setting placement to ', JSON.stringify(pos))

          host.setAttribute('position', au.xyzTriplet(pos))

          console.log('placement set to ', JSON.stringify(pos))

          justPlaced = true
        })
        
      }
      
      self.tick = () => {
        if (justPlaced) {
          justPlaced = false
          emitPlacedNext = true
        }
        else if (emitPlacedNext) {
          emitPlacedNext = false
          host.emit('placed')          
        }
      }
      
      console.log('update: host is loaded: ', host.hasLoaded)
      console.log('update: on is loaded: ', on.hasLoaded)

      on.addEventListener('loaded', placeOn)
    }
  }
})

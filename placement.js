/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('placement', {
  schema: {
    on: { type: "selector" }
  },
  init: function () {
    let self = this
    let host = self.el
    let au = aframeUtils
    let log = aframeUtils.log
    
    self.update = () => {
      let on = self.data.on
      let justPlaced = false
      let emitPlacedNext = false
      
      let sizeOf = el => {
        
        // return box.getSize(new THREE.Vector3())
      }
      
      
      let placeOn = () => {
        au.catching(() => {
          log('placeOn: on is loaded: ', on.hasLoaded)

          let on3d = on.object3D
          let onPos = on.object3D.position
          let host3d = host.object3D
          log(() => ['on pos: ', JSON.stringify(onPos)])

          let box = new THREE.Box3()
          let onSize = box.setFromObject(on3d).getSize(new THREE.Vector3())
          let hostSize = box.setFromObject(host3d).getSize(new THREE.Vector3())

          log(() => ['on size: ', JSON.stringify(onSize)])
          log(() => ['host size: ', JSON.stringify(hostSize)])

          let pos = onPos.clone()
          log('on pos y', onPos.y)
          log('on size y', onSize.y)
          let newY = onPos.y + (onSize.y / 2) + (hostSize.y / 2)
          log('newY', newY)
          pos.setY(newY)

          log(() => 'setting placement to ' + JSON.stringify(pos))

          host.setAttribute('position', au.xyzTriplet(pos))

          log(() => 'placement set to ' + JSON.stringify(pos))

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
      
      log('update: on is loaded: ', on.hasLoaded)

      if (on.hasLoaded) {
        placeOn()
      }
      else {
        on.addEventListener('loaded', placeOn)
      }
    }
  }
})

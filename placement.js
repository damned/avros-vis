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
    
    const PlacementBase = (baseEl) => {
      let onPlacements = []
      let instance = {
        placeOn: (placement) => {
          onPlacements.push(placement)
          let count = onPlacements.length + 1
          onPlacements.forEach((placementComponent, i) => {
            placementComponent.updatePlacement(i, count)
          })
        }
      }
      baseEl.placementBase = instance
      return instance
    }
    
    self.update = () => {
      let baseHost = self.data.on
      let justPlaced = false
      let emitPlacedNext = false
      
      let placeOn = () => {
        au.catching(() => {
          log('placeOn: on is loaded: ', baseHost.hasLoaded)
          log('on id: ', baseHost.id)
          log('host id: ', host.id)
          
          self.updatePlacement = (placeIndex, placeTotalCount) => {
            let on3d = baseHost.object3D
            let onPos = baseHost.object3D.position
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
          }

          let base = baseHost.placementBase || PlacementBase(baseHost)
          base.placeOn(self)

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
      
      log('update: on is loaded: ', baseHost.hasLoaded)

      if (baseHost.hasLoaded) {
        placeOn()
      }
      else {
        baseHost.addEventListener('loaded', placeOn)
      }
    }
  }
})

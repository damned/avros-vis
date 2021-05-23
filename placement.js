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
          let count = onPlacements.length
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
          log('placeOn: baseHost is loaded: ', baseHost.hasLoaded)
          log('baseHost id: ', baseHost.id)
          log('host id: ', host.id)
          
          self.updatePlacement = (placeIndex, placeTotalCount) => {
            log('placed id and count', placeIndex, placeTotalCount)
            let base3d = baseHost.object3D
            let basePos = base3d.getWorldPosition(new THREE.Vector3())
            let host3d = host.object3D
            log(() => ['base pos: ', JSON.stringify(basePos)])

            let box = new THREE.Box3()
            let baseSize = base3d.worldToLocal(box.setFromObject(base3d).getSize(new THREE.Vector3()))
            let hostSize = box.setFromObject(host3d).getSize(new THREE.Vector3())

            log(() => ['base size: ', JSON.stringify(baseSize)])
            log(() => ['host size: ', JSON.stringify(hostSize)])

            host
            let pos = host3d.worldToLocal(basePos)
            log('base pos y', basePos.y)
            log('base size y', basePos.y)
            let newY = basePos.y + (baseSize.y / 2) + (hostSize.y / 2)
            log('newY', newY)
            pos.setY(newY)
            
            let placedWidth = baseSize.x / placeTotalCount
            let placedHalfWidth = placedWidth / 2
            let baseLeft = basePos.x - (baseSize.x / 2)
            let x = baseLeft + placedHalfWidth + (placedWidth * placeIndex)
            pos.setX(x)
                        
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

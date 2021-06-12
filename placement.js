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
            log('host id: ', host.id)
            let base3d = baseHost.object3D
            log(() => ['base parent hasLoaded: ', base3d?.parent?.el?.hasLoaded])
            let basePos = base3d.getWorldPosition(new THREE.Vector3())
            let host3d = host.object3D
            log(() => ['base world pos: ', JSON.stringify(basePos)])

            let box = new THREE.Box3()
            let baseSize = box.setFromObject(base3d).getSize(new THREE.Vector3())
            let hostSize = box.setFromObject(host3d).getSize(new THREE.Vector3())

            log(() => ['base size: ', JSON.stringify(baseSize)])
            log(() => ['host size: ', JSON.stringify(hostSize)])

            host3d.updateWorldMatrix(true, false)
            let pos = basePos //host3d.worldToLocal(basePos)
            log('base pos y in host local coords', basePos.y)
            log('base size y', baseSize.y)
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
      
      log('update: baseHost is loaded: ', baseHost.hasLoaded)
      log('update: baseHost progenitor is loaded: ', au.earliestAncestor(baseHost).hasLoaded)

      if (au.earliestAncestor(baseHost).hasLoaded) {
        placeOn()
      }
      else {
        au.earliestAncestor(baseHost).addEventListener('loaded', placeOn)
      }
    }
  }
})
